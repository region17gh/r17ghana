import clip from "@/assets/program/videos/maabena-rosca.mp4.asset.json";
import clipPoster from "@/assets/program/videos/maabena-rosca.jpg.asset.json";
import type { ProgramVideo } from "@/lib/program-videos";
import { PRESS_ARTICLES } from "@/lib/press";

type Pointer = { default: { url: string } };
const small = import.meta.glob<Pointer>("@/assets/events/chicago-photos/*-640.jpg.asset.json", { eager: true });
const large = import.meta.glob<Pointer>("@/assets/events/chicago-photos/*-1600.jpg.asset.json", { eager: true });

export type RecapPhoto = { id: string; thumb: string; full: string; alt: string };

/** Photos shown before "Show all photos" (organiser approved all photos for public use). */
export const FEATURED_PHOTOS = ["aa-group-photo", "dsc07661", "dsc07684", "dsc07688", "dsc07746", "dsc07747", "dsc07760", "dsc07770", "dsc07781", "dsc07790", "dsc07792", "dsc07657"];

const ALT = "Ambassador Victor Smith with guests during the Chicago visit, November 2026";

export const RECAP_PHOTOS: RecapPhoto[] = Object.keys(small).sort().map((k) => {
  const id = k.split("/").pop()!.replace("-640.jpg.asset.json", "");
  const full = Object.entries(large).find(([p]) => p.includes(`${id}-1600`))?.[1].default.url ?? small[k]!.default.url;
  return { id, thumb: small[k]!.default.url, full, alt: ALT };
});

export const RECAP_CLIP: ProgramVideo = { id: "maabena-rosca", title: "Maabena on Region 17 and the diaspora", length: "1:04", src: clip.url, poster: clipPoster.url };

export type PressItem = { title: string; url: string };
/** Headlines as published by SankofaOnline; figures in them are the publisher's. */
export const PRESS: PressItem[] = [
  ...PRESS_ARTICLES.filter((article) => article.publisher === "SankofaOnline").map(({ title, url }) => ({ title, url })),
];

const tVid = import.meta.glob<Pointer>("@/assets/events/testimonials/*.mp4.asset.json", { eager: true });
const tPic = import.meta.glob<Pointer>("@/assets/events/testimonials/*.jpg.asset.json", { eager: true });
const T: [string, string][] = [
  ["Kellen Reeves", "0:36"], ["Guest from Chicago's West Side", "1:01"], ["Brenda", "0:25"], ["Chicago guest", "0:20"],
  ["Event caterer", "0:21"], ["Chicago-born guest", "0:17"], ["Jack Campbell", "0:39"], ["Chocolate maker", "0:22"],
];
/** Guest testimonials filmed at the Chicago roundtable; names only where two separate listens agree. */
export const TESTIMONIALS: ProgramVideo[] = T.map(([name, length], n) => {
  const k = `testimonial-${n + 1}`;
  const pick = (g: Record<string, Pointer>, ext: string) => Object.entries(g).find(([p]) => p.endsWith(`/${k}.${ext}.asset.json`))![1].default.url;
  return { id: `chicago-${k}`, title: `${name} on the roundtable`, length, src: pick(tVid, "mp4"), poster: pick(tPic, "jpg") };
});
