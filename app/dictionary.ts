import dictionaryListData from "../dictionaries/list.json";

export interface DictionaryEntry {
  word: string;
  reading: string;
  originalReading: string;
  selected: boolean;
  id: string;
}

export interface Dictionary {
  name: string;
  displayName: string;
  description: string;
  entries: DictionaryEntry[];
  selected: boolean;
}

export interface DictionaryConfig {
  name: string;
  displayName: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  dictionaries: DictionaryConfig[];
}

export interface DictionaryList {
  categories: Category[];
}

export const dictionaryList: DictionaryList = dictionaryListData;

function parseCsvEntries(csvText: string, dictionaryName: string): DictionaryEntry[] {
  const entries = [];
  const lines = csvText.trim().split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [word, reading] = line.split(",");
    if (word && reading) {
      const readingValue = reading.trim();
      entries.push({
        word: word.trim(),
        reading: readingValue,
        originalReading: readingValue,
        selected: true,
        id: `${dictionaryName}-${i}`,
      });
    }
  }

  return entries;
}

// すべての辞書データを事前にimportして準備
const csvModules = import.meta.glob("../dictionaries/*.csv", { as: "raw", eager: true });

export function getAllDictionaries(): {
  categories: Category[];
  dictionaries: Dictionary[];
} {
  const dictionaries: Dictionary[] = [];

  for (const category of dictionaryList.categories) {
    for (const dictConfig of category.dictionaries) {
      const csvPath = `../dictionaries/${dictConfig.name}.csv`;
      const csvText = csvModules[csvPath];
      
      if (csvText) {
        const entries = parseCsvEntries(csvText, dictConfig.name);
        dictionaries.push({
          name: dictConfig.name,
          displayName: dictConfig.displayName,
          description: "",
          entries,
          selected: true,
        });
      }
    }
  }

  return {
    categories: dictionaryList.categories,
    dictionaries,
  };
}