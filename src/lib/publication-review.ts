import { z } from "zod";
import { PRESS_ARTICLES } from "@/lib/press";

const slug = z.string().refine((value) => PRESS_ARTICLES.some((a) => a.slug === value), "Unknown article.");
export const publicationInput = z.object({ slug, state: z.enum(["draft", "published"]) });
export const publishSelectionInput = z.object({ questionIds: z.array(z.uuid()).max(100), articleSlugs: z.array(slug).max(100) });