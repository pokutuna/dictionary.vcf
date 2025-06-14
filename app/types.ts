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
  description: string;
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