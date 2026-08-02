export const QUOTES = [
  { text: "Small deeds done consistently are dearer than grand deeds done once.", tag: "Islamic wisdom" },
  { text: "Gratitude for what you have today opens the door to more tomorrow.", tag: "Islamic wisdom" },
  { text: "Trust the process, but still tie your camel — effort and faith walk together.", tag: "Islamic wisdom" },
  { text: "Patience is not waiting quietly; it is working steadily while you wait.", tag: "Islamic wisdom" },
  { text: "Every sincere intention plants a seed, even if the fruit isn't seen yet.", tag: "Islamic wisdom" },
  { text: "Forgive yourself for yesterday's slip; today is a fresh page.", tag: "Islamic wisdom" },
  { text: "Discipline is a form of worship when it's aimed at becoming better.", tag: "Islamic wisdom" },
  { text: "The one who guards their time guards their soul.", tag: "Islamic wisdom" },
  { text: "A single good habit kept sincerely outweighs a hundred good intentions left undone.", tag: "Islamic wisdom" },
  { text: "Ease follows hardship — keep moving, relief is closer than it feels.", tag: "Islamic wisdom" },
  { text: "Speak less, reflect more, and let your actions carry your words.", tag: "Islamic wisdom" },
  { text: "Humility is remembering how far you still have to grow.", tag: "Islamic wisdom" },
  { text: "The heart that gives thanks in hard times is never truly empty.", tag: "Islamic wisdom" },
  { text: "Sincerity turns even small work into something lasting.", tag: "Islamic wisdom" },
  { text: "Maturity is choosing the hard right over the easy wrong, quietly.", tag: "On maturity" },
  { text: "You don't rise to your goals, you fall to your systems — build good ones.", tag: "On maturity" },
  { text: "Progress is rarely loud. Most of it happens on days no one is watching.", tag: "On maturity" },
  { text: "The version of you a year from now is built today, in small decisions.", tag: "On maturity" },
  { text: "Comparison steals focus. Your only real competition is yesterday's you.", tag: "On maturity" },
  { text: "Discomfort today is just tomorrow's competence in disguise.", tag: "On maturity" },
  { text: "A calm mind gets more done than a rushed one.", tag: "On maturity" },
  { text: "Consistency beats intensity — show up small, but show up daily.", tag: "On maturity" },
  { text: "Rest is not the opposite of discipline, it's part of it.", tag: "On maturity" },
  { text: "The people who finish are rarely the most talented — they're the most steady.", tag: "On maturity" },
  { text: "Growth is uncomfortable by design; if it felt easy, it wouldn't be growth.", tag: "On maturity" },
  { text: "Say what you mean, do what you say — that's the whole of integrity.", tag: "On maturity" },
  { text: "You can't pour from an empty cup; protect your own foundation first.", tag: "On maturity" },
  { text: "Every expert was once a beginner who refused to quit on a bad day.", tag: "On maturity" },
];

export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
