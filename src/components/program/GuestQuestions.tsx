export interface GuestQuestion { id: string; question: string }

export function GuestQuestions({ questions }: { questions: readonly GuestQuestion[] }) {
  return <><h3 className="program-h2">Questions from guests</h3>
    <div aria-live="polite">{questions.length ? <ul>{questions.map((q) => <li key={q.id}>{q.question}</li>)}</ul> : <p className="program-note">No questions have been published yet.</p>}</div>
  </>;
}