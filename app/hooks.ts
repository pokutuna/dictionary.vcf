import { useState, useCallback } from "react";
import type { Dictionary } from "./dictionary";

export function useDictionaryState(initialDictionaries: Dictionary[]) {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>(initialDictionaries);

  const toggleDictionary = useCallback((name: string) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === name) {
          const newSelected = !dict.selected;
          const updatedEntries = dict.entries.map((entry) => ({
            ...entry,
            selected: newSelected,
          }));
          return { ...dict, selected: newSelected, entries: updatedEntries };
        }
        return dict;
      })
    );
  }, []);

  const toggleEntry = useCallback((dictName: string, entryId: string) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === dictName) {
          const updatedEntries = dict.entries.map((entry) =>
            entry.id === entryId
              ? { ...entry, selected: !entry.selected }
              : entry
          );

          const allEntriesSelected = updatedEntries.every(
            (entry) => entry.selected
          );
          const noEntriesSelected = updatedEntries.every(
            (entry) => !entry.selected
          );

          let newDictSelected = dict.selected;
          if (allEntriesSelected) {
            newDictSelected = true;
          } else if (noEntriesSelected) {
            newDictSelected = false;
          } else {
            newDictSelected = false;
          }

          return {
            ...dict,
            entries: updatedEntries,
            selected: newDictSelected,
          };
        }
        return dict;
      })
    );
  }, []);

  const updateReading = useCallback((
    dictName: string,
    entryId: string,
    newReading: string
  ) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === dictName) {
          const updatedEntries = dict.entries.map((entry) =>
            entry.id === entryId ? { ...entry, reading: newReading } : entry
          );
          return { ...dict, entries: updatedEntries };
        }
        return dict;
      })
    );
  }, []);

  const selectAll = useCallback(() => {
    setDictionaries((prev) =>
      prev.map((dict) => ({
        ...dict,
        selected: true,
        entries: dict.entries.map((entry) => ({ ...entry, selected: true })),
      }))
    );
  }, []);

  const deselectAll = useCallback(() => {
    setDictionaries((prev) =>
      prev.map((dict) => ({
        ...dict,
        selected: false,
        entries: dict.entries.map((entry) => ({ ...entry, selected: false })),
      }))
    );
  }, []);

  return {
    dictionaries,
    setDictionaries,
    toggleDictionary,
    toggleEntry,
    updateReading,
    selectAll,
    deselectAll,
  };
}