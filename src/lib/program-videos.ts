import a1 from "@/assets/program/videos/resetting-ghana-agenda.mp4.asset.json";
import p1 from "@/assets/program/videos/resetting-ghana-agenda.jpg.asset.json";
import a2 from "@/assets/program/videos/open-for-business-mahama.mp4.asset.json";
import p2 from "@/assets/program/videos/open-for-business-mahama.jpg.asset.json";
import a3 from "@/assets/program/videos/ghana-open-for-business-final-cut.mp4.asset.json";
import p3 from "@/assets/program/videos/ghana-open-for-business-final-cut.jpg.asset.json";
import a4 from "@/assets/program/videos/mahama-inauguration-speech.mp4.asset.json";
import p4 from "@/assets/program/videos/mahama-inauguration-speech.jpg.asset.json";
import a5 from "@/assets/program/videos/ghana-open-for-business-music.mp4.asset.json";
import p5 from "@/assets/program/videos/ghana-open-for-business-music.jpg.asset.json";
import a6 from "@/assets/program/videos/ghana-in-30-seconds-gipc.mp4.asset.json";
import p6 from "@/assets/program/videos/ghana-in-30-seconds-gipc.jpg.asset.json";

export type ProgramVideo = { id: string; title: string; length: string; src: string; poster: string };

/** Watch only: guests may not download these (organiser's decision). */
export const MAIN_VIDEO: ProgramVideo = { id: "resetting-ghana-agenda", title: "The Resetting Ghana Agenda", length: "4:08", src: a1.url, poster: p1.url };

export const MORE_VIDEOS: ProgramVideo[] = [
  { id: "open-for-business-mahama", title: "Open for business: President Mahama", length: "2:26", src: a2.url, poster: p2.url },
  { id: "ghana-open-for-business", title: "Ghana open for business", length: "1:40", src: a3.url, poster: p3.url },
  { id: "inauguration-speech", title: "President Mahama inauguration speech", length: "2:10", src: a4.url, poster: p4.url },
  { id: "ghana-open-for-business-music", title: "Ghana open for business (music)", length: "2:37", src: a5.url, poster: p5.url },
  { id: "ghana-in-30-seconds", title: "Ghana in 30 seconds (GIPC)", length: "0:35", src: a6.url, poster: p6.url },
];
