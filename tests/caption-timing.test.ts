import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const durations = { "ghana-in-30-seconds": 35.413, "ghana-open-for-business": 100.202, "ghana-open-for-business-music": 156.928, "inauguration-speech": 130.240, "open-for-business-mahama": 145.813, "resetting-ghana-agenda": 248.533 };
const seconds = (stamp: string) => stamp.split(":").reduce((total, part) => total * 60 + Number(part), 0);
for (const [id, duration] of Object.entries(durations)) {
  test(`${id}: captions are ordered and end within the recording`, () => {
    const vtt = readFileSync(`public/captions/${id}.vtt`, "utf8");
    const cues = [...vtt.matchAll(/(\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}\.\d{3})/g)];
    expect(cues.length).toBeGreaterThan(0);
    let previous = 0;
    for (const cue of cues) {
      const start = seconds(cue[1]); const end = seconds(cue[2]);
      expect(start).toBeGreaterThanOrEqual(previous);
      expect(end).toBeGreaterThan(start);
      expect(end).toBeLessThanOrEqual(duration);
      previous = end;
    }
  });
}