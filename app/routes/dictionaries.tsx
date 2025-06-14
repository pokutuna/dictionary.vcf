import { useState, useEffect } from "react";
import type { Route } from "./+types/dictionaries";

interface DictionaryEntry {
  word: string;
  reading: string;
  selected: boolean;
  id: string;
}

interface Dictionary {
  name: string;
  displayName: string;
  description: string;
  entries: DictionaryEntry[];
  selected: boolean;
}

interface DictionaryConfig {
  name: string;
  displayName: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  dictionaries: DictionaryConfig[];
}

interface DictionaryList {
  categories: Category[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dictionary Manager - Dictionary VCF" },
    {
      name: "description",
      content: "Select dictionaries and generate VCF files",
    },
  ];
}

async function loadDictionaryList(): Promise<DictionaryList> {
  try {
    const listModule = await import("../../dictionaries/list.json");
    return listModule.default;
  } catch (error) {
    console.error("Failed to load dictionary list:", error);
    // Fallback to empty structure
    return { categories: [] };
  }
}

async function loadDictionary(name: string): Promise<DictionaryEntry[]> {
  try {
    // Import CSV file as raw text
    const csvModule = await import(`../../dictionaries/${name}.csv?raw`);
    const csvText = csvModule.default;

    const entries: DictionaryEntry[] = [];
    const lines = csvText.trim().split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [word, reading] = line.split(",");
      if (word && reading) {
        entries.push({
          word: word.trim(),
          reading: reading.trim(),
          selected: false,
          id: `${name}-${i}`,
        });
      }
    }

    return entries;
  } catch (error) {
    console.error(`Failed to load dictionary ${name}:`, error);
    return [];
  }
}

function generateVCF(dictionaries: Dictionary[]): string {
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

function downloadVCF(content: string) {
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

export default function Dictionaries() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDict, setExpandedDict] = useState<string | null>(null);

  useEffect(() => {
    async function loadDictionaries() {
      const dictionaryList = await loadDictionaryList();
      const dicts: Dictionary[] = [];

      for (const category of dictionaryList.categories) {
        for (const dictConfig of category.dictionaries) {
          const entries = await loadDictionary(dictConfig.name);
          dicts.push({
            name: dictConfig.name,
            displayName: dictConfig.displayName,
            description: dictConfig.description,
            entries,
            selected: false,
          });
        }
      }

      setCategories(dictionaryList.categories);
      setDictionaries(dicts);
      setLoading(false);
    }

    loadDictionaries();
  }, []);

  const toggleDictionary = (name: string) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === name) {
          const newSelected = !dict.selected;
          // When selecting dictionary, select all entries; when deselecting, deselect all entries
          const updatedEntries = dict.entries.map((entry) => ({
            ...entry,
            selected: newSelected,
          }));
          return { ...dict, selected: newSelected, entries: updatedEntries };
        }
        return dict;
      })
    );
  };

  const toggleAll = (select: boolean) => {
    setDictionaries((prev) =>
      prev.map((dict) => ({
        ...dict,
        selected: select,
        entries: dict.entries.map((entry) => ({ ...entry, selected: select })),
      }))
    );
  };

  const toggleEntry = (dictName: string, entryId: string) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === dictName) {
          const updatedEntries = dict.entries.map((entry) =>
            entry.id === entryId
              ? { ...entry, selected: !entry.selected }
              : entry
          );

          // Check if all entries are selected to determine dictionary selection state
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
            // Some entries selected, some not - keep dictionary unselected
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
  };

  const toggleAllEntriesInDict = (dictName: string, select: boolean) => {
    setDictionaries((prev) =>
      prev.map((dict) => {
        if (dict.name === dictName) {
          const updatedEntries = dict.entries.map((entry) => ({
            ...entry,
            selected: select,
          }));
          return { ...dict, entries: updatedEntries, selected: select };
        }
        return dict;
      })
    );
  };

  const updateReading = (
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
  };

  const handleGenerateVCF = () => {
    const vcfContent = generateVCF(dictionaries);
    downloadVCF(vcfContent);
  };

  const selectedCount = dictionaries.filter((d) => d.selected).length;
  const totalSelectedEntries = dictionaries.reduce(
    (sum, dict) => sum + dict.entries.filter((e) => e.selected).length,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dictionaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dictionary Manager
          </h1>
          <p className="text-gray-600">
            Select dictionaries to generate a VCF file for macOS voice input
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => toggleAll(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="text-sm text-gray-600">
              {selectedCount} dictionaries selected • {totalSelectedEntries}{" "}
              total entries selected
            </div>
          </div>

          <button
            onClick={handleGenerateVCF}
            disabled={totalSelectedEntries === 0}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Generate & Download VCF
          </button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-4">
                {category.dictionaries.map((dictConfig) => {
                  const dict = dictionaries.find(
                    (d) => d.name === dictConfig.name
                  );
                  if (!dict) return null;

                  return (
                    <div
                      key={dict.name}
                      className="bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={dict.selected}
                              onChange={() => toggleDictionary(dict.name)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {dict.displayName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {dict.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {dict.entries.length} entries
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setExpandedDict(
                                  expandedDict === dict.name ? null : dict.name
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {expandedDict === dict.name ? "Hide" : "Show"}{" "}
                              entries
                            </button>

                            {expandedDict === dict.name && (
                              <>
                                <button
                                  onClick={() =>
                                    toggleAllEntriesInDict(dict.name, true)
                                  }
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  Select All
                                </button>
                                <button
                                  onClick={() =>
                                    toggleAllEntriesInDict(dict.name, false)
                                  }
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Clear All
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {expandedDict === dict.name && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {dict.entries.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                  <input
                                    type="checkbox"
                                    checked={entry.selected}
                                    onChange={() =>
                                      toggleEntry(dict.name, entry.id)
                                    }
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                  />

                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="font-mono text-sm font-medium">
                                      {entry.word}
                                    </div>

                                    <input
                                      type="text"
                                      value={entry.reading}
                                      onChange={(e) =>
                                        updateReading(
                                          dict.name,
                                          entry.id,
                                          e.target.value
                                        )
                                      }
                                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="読み仮名"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
