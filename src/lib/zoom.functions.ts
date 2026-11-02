import { createServerFn } from "@tanstack/react-start";

import { signMeetingSdkJwt } from "./zoom.server";

export type ZoomJoin =
  | { ready: false }
  | { ready: true; sdkKey: string; signature: string; meetingNumber: string; passcode: string; appUrl: string };

/** Public by design (open attendance). Returns an attendee-only, short-lived signature. */
export const getZoomJoin = createServerFn({ method: "GET" }).handler(async (): Promise<ZoomJoin> => {
  const sdkKey = process.env["ZOOM_SDK_KEY"];
  const secret = process.env["ZOOM_SDK_SECRET"];
  const meetingNumber = process.env["ZOOM_MEETING_NUMBER"]?.replace(/\D/g, "");
  const rawPasscode = (process.env["ZOOM_MEETING_PASSCODE"] ?? "").trim();
  // The setup instructions ask for "none" when the meeting has no passcode.
  const passcode = rawPasscode.toLowerCase() === "none" ? "" : rawPasscode;
  if (!sdkKey || !secret || !meetingNumber) return { ready: false };
  const signature = await signMeetingSdkJwt(sdkKey, secret, meetingNumber, Math.floor(Date.now() / 1000));
  const appUrl = `https://zoom.us/j/${meetingNumber}${passcode ? `?pwd=${encodeURIComponent(passcode)}` : ""}`;
  return { ready: true, sdkKey, signature, meetingNumber, passcode, appUrl };
});
