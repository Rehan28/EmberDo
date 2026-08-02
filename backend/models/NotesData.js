const mongoose = require('mongoose');

// Singleton document: one collection, one row, holding all folders + notes.
const FolderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const NoteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    folderId: { type: String, required: true },
    title: { type: String, default: 'Untitled' },
    content: { type: String, default: '' },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { _id: false }
);

const NotesDataSchema = new mongoose.Schema({
  folders: { type: [FolderSchema], default: [{ id: 'root', name: 'General' }] },
  notes: { type: [NoteSchema], default: [] },
});

module.exports = mongoose.model('NotesData', NotesDataSchema);
