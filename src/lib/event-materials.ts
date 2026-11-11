import { PROGRAM_MC, PROGRAM_PLACE, PROGRAM_TITLE, RUN_OF_SHOW, SPEAKERS, formatRange } from "@/lib/program";
import { MAIN_VIDEO, MORE_VIDEOS } from "@/lib/program-videos";

/** Plain-text pack of everything published on the program page. The Q&A answers only from this. */
export function eventMaterials(): string {
  const speakers = SPEAKERS.map((s) => `${s.name}, ${s.role}.\n${s.bio.join("\n")}`).join("\n\n");
  const ros = RUN_OF_SHOW.map((s) => `${formatRange(s, "America/Chicago")} Central: ${s.title}${s.lead ? ` (${s.lead})` : ""}`).join("\n");
  const videos = [MAIN_VIDEO, ...MORE_VIDEOS].map((v, i) => `${i + 1}. "${v.title}", ${v.length}${i === 0 ? " (main video, shown above the run of show)" : ""}. Watch only, not downloadable.`).join("\n");
  return `EVENT: ${PROGRAM_TITLE}\n${PROGRAM_PLACE}\n${PROGRAM_MC}\n\nSPEAKERS\n${speakers}\n\nRUN OF SHOW\n${ros}\n\nVIDEOS (titles and lengths only; no transcripts are published yet)\n${videos}`;
}
