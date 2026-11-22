import { Link } from "@tanstack/react-router";
import { Field, Input } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { Button } from "@/components/ui/Button";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export function AdminLogin() {
  const f = useAdminAccess();
  return <main className="events-hub">
    <Link to="/{-$locale}/events" params={{ locale: undefined }}>Region 17 events</Link>
    <h1 className="program-h1">Team sign in</h1>
    <p className="program-lede">Approve Boston questions and publish press coverage.</p>
    {f.session.isPending ? <p role="status">Checking sign-in...</p> : f.sent ? <p role="status">Check your inbox for your sign-in link. Open it on this device to continue.</p> :
      <form className="invest-stack" onSubmit={(e) => { e.preventDefault(); void f.send(); }}>
        <Field label="Member email"><Input type="email" autoComplete="email" required value={f.email} onChange={(e) => f.setEmail(e.target.value)} /></Field>
        <div><Button size="lg" type="submit" disabled={f.busy}>{f.busy ? "Sending..." : "Email my sign-in link"}</Button></div>
        {f.error && <p role="alert">{f.error}</p>}
      </form>}
    <p className="program-meta">Access is restricted to approved Region 17 platform operators.</p>
  </main>;
}