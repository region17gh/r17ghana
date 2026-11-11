import { describe, expect, it } from "bun:test";
import { eventMaterials } from "@/lib/event-materials";

describe("event Q&A materials", () => {
  it("lists all six videos with the main one first", () => {
    const m = eventMaterials();
    expect(m).toContain('1. "The Resetting Ghana Agenda"');
    expect(m).toContain('6. "Ghana in 30 seconds (GIPC)"');
  });
  it("tells the model videos are watch only", () => {
    expect(eventMaterials().match(/Watch only, not downloadable/g)).toHaveLength(6);
  });
});
