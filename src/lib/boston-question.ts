import { z } from "zod";

export const bostonQuestionInput = z.object({
  question: z.string().trim().min(3, "Enter at least 3 characters.").max(500),
  publicationPermission: z.literal(true, { error: "Allow publication before submitting." }),
});
export const bostonReviewInput = z.object({ id: z.uuid(), state: z.enum(["approved", "rejected", "pending"]) });