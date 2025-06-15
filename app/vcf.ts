import type { Dictionary, DictionaryEntry } from "./dictionary";

const GITHUB_PAGES_URL = "https://pokutuna.github.io/dictionary.vcf/";

function getSelectedEntries(dictionaries: Dictionary[]): DictionaryEntry[] {
  const selectedEntries: DictionaryEntry[] = [];
  dictionaries.forEach((dict) => {
    dict.entries.forEach((entry) => {
      if (entry.selected) {
        selectedEntries.push(entry);
      }
    });
  });
  return selectedEntries;
}

function deduplicateEntries(entries: DictionaryEntry[]): DictionaryEntry[] {
  return Array.from(
    new Map(entries.map((entry) => [entry.word, entry])).values()
  ).sort((a, b) => a.word.localeCompare(b.word));
}

function createVCardString(entry: DictionaryEntry): string {
  return `
BEGIN:VCARD
VERSION:3.0
PRODID:dictionary.vcf
N:;;;;
FN:${entry.word}
ORG:${entry.word}
X-PHONETIC-ORG:${entry.reading}
X-ABShowAs:COMPANY
NOTE:${GITHUB_PAGES_URL}
END:VCARD
`.trim();
}

export function generateVCF(dictionaries: Dictionary[]): string {
  const selectedEntries = getSelectedEntries(dictionaries);
  const uniqueEntries = deduplicateEntries(selectedEntries);

  return uniqueEntries.map(createVCardString).join("\n\n");
}

export function downloadVCF(content: string) {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, "");
  const filename = `dictionary_${timestamp}.vcf`;

  const blob = new Blob([content], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
