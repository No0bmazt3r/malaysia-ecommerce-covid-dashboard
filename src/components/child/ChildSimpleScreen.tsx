"use client";
import { ChildScreen } from "./ChildScreen";

/* Fallback for routes that have no Simple View (timeline, insights, team):
   just the nav tiles and a friendly pointer back to the four big pages. */
export function ChildSimpleScreen() {
  return (
    <ChildScreen title="Let's Pick a Page!" sentence="Tap one of the big buttons above to explore.">
      <div />
    </ChildScreen>
  );
}
