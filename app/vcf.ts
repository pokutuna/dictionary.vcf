import type { Dictionary, DictionaryEntry } from "./types";

export function generateVCF(dictionaries: Dictionary[]): string {
  const selectedEntries: DictionaryEntry[] = [];

  dictionaries.forEach((dict) => {
    dict.entries.forEach((entry) => {
      // Include all selected entries (both individually selected and from selected dictionaries)
      if (entry.selected) {
        selectedEntries.push(entry);
      }
    });
  });

  // Remove duplicates by word and sort
  const uniqueEntries = Array.from(
    new Map(selectedEntries.map((entry) => [entry.word, entry])).values()
  ).sort((a, b) => a.word.localeCompare(b.word));

  const vcfContent = uniqueEntries
    .map(
      (entry) =>
        `BEGIN:VCARD\nVERSION:3.0\nFN:${entry.word}\nX-PHONETIC-LAST-NAME:${entry.reading}\nEND:VCARD`
    )
    .join("\n\n");

  return vcfContent;
}

export function downloadVCF(content: string) {
  const blob = new Blob([content], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dictionary.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}