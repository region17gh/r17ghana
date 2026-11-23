type Question = { id: string; question: string };

/** Stage locally without changing either the live list or publication records. */
export function previewQuestions(live: readonly Question[], selected: readonly Question[]): Question[] {
  return [...live, ...selected.filter((question) => !live.some((item) => item.id === question.id))];
}