import { z } from "zod";

export const investorQuestionInput = z.object({
  question: z.string().trim().min(3).max(500),
  email: z.string().trim().max(254).optional().default(""),
  replyPermission: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (data.email && (!z.email().safeParse(data.email).success || !data.replyPermission)) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email and allow a reply, or leave the email blank." });
  }
});

export const replyInput = z.object({ id: z.uuid(), body: z.string().trim().min(3).max(5000) });

export function requireOperator(allowed: boolean | null, failed = false) {
  if (failed || allowed !== true) throw new Error("Administrator access is required.");
}