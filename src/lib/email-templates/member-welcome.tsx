import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { emailTheme as s } from "./theme";
import en from "@/i18n/locales/en.json";

interface Props { name?: string; memberNumber?: string; credentialId?: string; test?: boolean }
function MemberWelcome({ name, memberNumber, credentialId, test }: Props) {
  return <Html lang="en"><Head /><Preview>Your permanent membership record and next step.</Preview>
    <Body style={s.body}><Container style={s.container}>
      <Heading>Region 17 Ghana</Heading>
      {test && <Text>TEST PREVIEW. These demonstration details do not create or certify membership.</Text>}
      <Text>{name ? `Welcome, ${name}.` : "Welcome."}</Text>
      <Text>Your membership is free and permanent.</Text>
      <Button href="https://r17gh.com/home" style={s.button}>View your membership</Button>
      <Text style={s.mono}>Member number: {memberNumber || "Not provided"}</Text>
      <Text style={s.mono}>Credential ID: {credentialId || "Not provided"}</Text>
      <Text>{en.legal.notAGovernmentDocument}</Text>
      <Text>The Region 17 Ghana team</Text>
    </Container></Body></Html>;
}
export const template = {
  component: MemberWelcome,
  subject: (data: Record<string, unknown>) => data.test ? "TEST: Region 17 member welcome" : "Welcome to Region 17 Ghana",
  displayName: "Member welcome",
  previewData: { name: "Guest", memberNumber: "DEMO", credentialId: "DEMO, not a credential", test: true },
} satisfies TemplateEntry;