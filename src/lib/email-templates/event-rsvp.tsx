import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { emailTheme as s } from "./theme";
import { PROGRAM_TITLE, PROGRAM_PLACE } from "@/lib/program";
import { FEATURED_EVENT } from "@/lib/event";

function timeRange(zone: string) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit" });
  return `${f.format(FEATURED_EVENT.startsAt)} to ${f.format(FEATURED_EVENT.endsAt)}`;
}
function EventRsvp({ name, test }: { name?: string; test?: boolean }) {
  return <Html lang="en"><Head /><Preview>Your event date, viewing times, and program.</Preview>
    <Body style={s.body}><Container style={s.container}>
      <Heading>Region 17 Ghana</Heading>
      {test && <Text>TEST PREVIEW. This email does not register you or confirm a Luma RSVP.</Text>}
      <Text>{name ? `Hello, ${name}.` : "Hello."}</Text>
      <Text>{PROGRAM_TITLE}</Text><Text>{PROGRAM_PLACE}</Text>
      <Text>Central (CST): {timeRange("America/Chicago")}<br />West Coast (PST): {timeRange("America/Los_Angeles")}<br />GMT: {timeRange("Etc/UTC")}</Text>
      <Button href="https://r17gh.com/program" style={s.button}>View the event program</Button>
      <Text>Online viewing: https://r17gh.com/live</Text>
      <Text>The Region 17 Ghana team</Text>
    </Container></Body></Html>;
}
export const template = {
  component: EventRsvp,
  subject: (data: Record<string, unknown>) => data.test ? "TEST: Region 17 event RSVP" : "Your Region 17 event RSVP",
  displayName: "Event RSVP confirmation",
  previewData: { name: "Guest", test: true },
} satisfies TemplateEntry;