import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { emailTheme as s } from "./theme";

function InvestorReply({ question, reply }: { question?: string; reply?: string }) {
  return <Html lang="en"><Head /><Preview>The Region 17 team has replied to your question.</Preview>
    <Body style={s.body}><Container style={s.container}><Heading>Region 17 Ghana</Heading>
      <Text>Your question: {question}</Text><Text>{reply}</Text>
      <Text>The Region 17 Ghana team</Text>
    </Container></Body></Html>;
}
export const template = { component: InvestorReply, subject: "Your question to Region 17 Ghana", displayName: "Investor question reply", previewData: { question: "Which sectors are listed?", reply: "Please see the sectors published on our invest page." } } satisfies TemplateEntry;