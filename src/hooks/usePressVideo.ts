import { useState } from "react";

export function usePressVideo() {
  const [playing, setPlaying] = useState(false);
  return { playing, play: () => setPlaying(true) };
}