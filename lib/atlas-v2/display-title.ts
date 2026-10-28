// Display titles: strip leading emoji/pictographs at display time only.
// Stored titles keep their prefixes (including the NIC "🔌" prefix per D-09);
// this helper never mutates stored data. Titles that begin with chapter
// numbers ("15 · ...") are untouched: "·" is not a pictograph, and digits
// are not pictographs. Used by the homepage (Phase 1); the Reader adopts
// it in Phase 2 (G-06).
export function displayTitle(title: string): string {
  return title.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "");
}
