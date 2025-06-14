import type { Dictionary } from "./dictionary";

export function calculateStats(dictionaries: Dictionary[]) {
  const selectedCount = dictionaries.filter((d) => d.selected).length;
  const totalSelectedEntries = dictionaries.reduce(
    (sum, dict) => sum + dict.entries.filter((e) => e.selected).length,
    0
  );
  const totalEntries = dictionaries.reduce(
    (sum, dict) => sum + dict.entries.length,
    0
  );
  const allSelected = totalSelectedEntries === totalEntries && totalEntries > 0;

  return {
    selectedCount,
    totalSelectedEntries,
    totalEntries,
    allSelected,
  };
}