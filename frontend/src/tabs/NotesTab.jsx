import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { api } from '../api';
import { uid } from '../utils/date';
import { useToast } from '../components/ToastContext';

export default function NotesTab() {
  const [folders, setFolders] = useState([{ id: 'root', name: 'General' }]);
  const [notes, setNotes] = useState([]);
  const [activeFolder, setActiveFolder] = useState('root');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [folderDraft, setFolderDraft] = useState('root');
  const [contentDraft, setContentDraft] = useState('');
  const showToast = useToast();

  useEffect(() => {
    let active = true;
    api
      .getNotes()
      .then((data) => {
        if (!active) return;
        setFolders(data.folders && data.folders.length ? data.folders : [{ id: 'root', name: 'General' }]);
        setNotes(data.notes || []);
      })
      .catch(() => showToast('Could not load notes', true));
    return () => {
      active = false;
    };
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  useEffect(() => {
    if (activeNote) {
      setTitleDraft(activeNote.title || '');
      setFolderDraft(activeNote.folderId);
      setContentDraft(activeNote.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId]);

  async function persist(nextFolders, nextNotes) {
    setFolders(nextFolders);
    setNotes(nextNotes);
    try {
      await api.putNotes({ folders: nextFolders, notes: nextNotes });
    } catch {
      showToast('Could not save — storage error', true);
    }
  }

  function selectFolder(id) {
    setActiveFolder(id);
    setActiveNoteId(null);
  }

  function addFolder() {
    const name = prompt('Folder name:');
    if (!name || !name.trim()) return;
    const f = { id: uid(), name: name.trim() };
    persist([...folders, f], notes);
    setActiveFolder(f.id);
  }

  function addNote() {
    const n = { id: uid(), folderId: activeFolder, title: 'Untitled', content: '', updatedAt: Date.now() };
    persist(folders, [...notes, n]);
    setActiveNoteId(n.id);
    setPreview(false);
  }

  function selectNote(id) {
    setActiveNoteId(id);
    setPreview(false);
  }

  function saveNote() {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? {
            ...n,
            title: titleDraft.trim() || 'Untitled',
            folderId: folderDraft,
            content: contentDraft,
            updatedAt: Date.now(),
          }
        : n
    );
    persist(folders, updated);
    setActiveFolder(folderDraft);
    showToast('Note saved');
  }

  function deleteNote() {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    persist(
      folders,
      notes.filter((n) => n.id !== activeNoteId)
    );
    setActiveNoteId(null);
  }

  const notesInFolder = notes.filter((n) => n.folderId === activeFolder);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Notes</div>
          <h1>Markdown Notes</h1>
        </div>
      </div>
      <div className="notes-layout">
        <div className="notes-sidebar">
          <div className="notes-sidebar-head">
            <span>Folders</span>
            <button className="icon-btn" onClick={addFolder} title="New folder">
              +
            </button>
          </div>
          <div className="folder-list">
            {folders.map((f) => {
              const count = notes.filter((n) => n.folderId === f.id).length;
              return (
                <button
                  key={f.id}
                  className={`folder-item ${activeFolder === f.id ? 'active' : ''}`}
                  onClick={() => selectFolder(f.id)}
                >
                  <span>{f.name}</span>
                  <span className="folder-count">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="notes-sidebar-head">
            <span>Notes</span>
            <button className="icon-btn" onClick={addNote} title="New note">
              +
            </button>
          </div>
          <div className="note-list">
            {notesInFolder.length === 0 && <div className="empty-row">No notes in this folder yet.</div>}
            {notesInFolder.map((n) => (
              <button
                key={n.id}
                className={`note-item ${activeNoteId === n.id ? 'active' : ''}`}
                onClick={() => selectNote(n.id)}
              >
                <div className="note-item-title">{n.title || 'Untitled'}</div>
                <div className="note-item-snippet">{(n.content || '').slice(0, 60)}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="notes-main">
          {!activeNote && <div className="empty-row notes-empty">Select or create a note to start writing.</div>}
          {activeNote && (
            <div className="note-editor">
              <div className="note-editor-top">
                <input
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  placeholder="Note title"
                />
                <select value={folderDraft} onChange={(e) => setFolderDraft(e.target.value)}>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="note-editor-tabs">
                <button className={`tab-btn ${!preview ? 'active' : ''}`} onClick={() => setPreview(false)}>
                  Write
                </button>
                <button className={`tab-btn ${preview ? 'active' : ''}`} onClick={() => setPreview(true)}>
                  Preview
                </button>
              </div>
              {preview ? (
                <div className="note-preview" dangerouslySetInnerHTML={{ __html: marked.parse(contentDraft || '') }} />
              ) : (
                <textarea
                  id="noteContent"
                  placeholder="Write in Markdown..."
                  value={contentDraft}
                  onChange={(e) => setContentDraft(e.target.value)}
                />
              )}
              <div className="note-editor-actions">
                <button className="btn-primary" onClick={saveNote}>
                  Save
                </button>
                <button className="btn-ghost" onClick={deleteNote}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
