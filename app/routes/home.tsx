import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import type { Route } from "./+types/home";
import type { Dictionary, Category, DictionaryList } from "../types";
import { generateVCF, downloadVCF } from "../vcf";
import {
  LoadingSpinner,
  StatsDisplay,
  CategoryHeader,
  DictionaryCard,
} from "../components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "macOS 音声入力向け辞書 | dictionary.vcf" },
    {
      name: "description",
      content:
        "プログラミング用語の辞書をVCFファイルとして出力し、macOS音声入力の認識を向上させます",
    },
  ];
}

async function loadDictionaryList(): Promise<DictionaryList> {
  try {
    const listModule = await import("../../dictionaries/list.json");
    return listModule.default;
  } catch (error) {
    console.error("Failed to load dictionary list:", error);
    return { categories: [] };
  }
}

async function loadDictionary(name: string) {
  try {
    const csvModule = await import(`../../dictionaries/${name}.csv?raw`);
    const csvText = csvModule.default;

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

export default function Home() {
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
            selected: true,
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

  const toggleEntry = (dictName: string, entryId: string) => {
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

  const handleSelectAll = () => {
    setDictionaries((prev) =>
      prev.map((dict) => ({
        ...dict,
        selected: true,
        entries: dict.entries.map((entry) => ({ ...entry, selected: true })),
      }))
    );
  };

  const handleDeselectAll = () => {
    setDictionaries((prev) =>
      prev.map((dict) => ({
        ...dict,
        selected: false,
        entries: dict.entries.map((entry) => ({ ...entry, selected: false })),
      }))
    );
  };

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header & Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 m-4">
              macOS 音声入力用連絡先ジェネレーター
            </h1>
            <p className="text-gray-600 mb-2">
              認識されにくい用語を連絡先に追加することで音声入力を改善しよう
              <br />
              連絡先はメチャクチャになります
            </p>
            <a
              href="https://github.com/pokutuna/dictionary.vcf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              GitHub: pokutuna/dictionary.vcf
              <ExternalLink size={12} />
            </a>
          </div>

          {/* 説明文 */}
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-4">
            💡
            連絡先に含める辞書・単語の選択、音声入力の際のよみがなの編集ができます
          </div>

          {/* Action Bar */}
          <div className="flex items-start justify-between gap-4">
            {/* 左側: 選択操作とその下に統計情報 */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  disabled={allSelected}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span className="text-xs">☑</span>
                  すべて選択
                </button>

                <button
                  onClick={handleDeselectAll}
                  disabled={totalSelectedEntries === 0}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span className="text-xs">☐</span>
                  すべて解除
                </button>
              </div>

              {/* 統計情報を選択ボタンの下に */}
              <div className="text-sm text-gray-600">
                <StatsDisplay
                  selectedCount={selectedCount}
                  totalSelectedEntries={totalSelectedEntries}
                />
              </div>
            </div>

            {/* 右側: ダウンロードボタン（大きく） */}
            <button
              onClick={handleGenerateVCF}
              disabled={totalSelectedEntries === 0}
              className="flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
            >
              <span className="text-xl">⬇</span>
              連絡先 (.vcf) をダウンロード
            </button>
          </div>
        </div>

        {/* Dictionary Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <CategoryHeader category={category} />

              <div className="grid gap-3">
                {category.dictionaries.map((dictConfig) => {
                  const dict = dictionaries.find(
                    (d) => d.name === dictConfig.name
                  );
                  if (!dict) return null;

                  return (
                    <DictionaryCard
                      key={dict.name}
                      dict={dict}
                      isExpanded={expandedDict === dict.name}
                      onToggleDictionary={toggleDictionary}
                      onToggleExpanded={(name) =>
                        setExpandedDict(expandedDict === name ? null : name)
                      }
                      onToggleEntry={toggleEntry}
                      onUpdateReading={updateReading}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - 追加歓迎メッセージ */}
        <div className="text-center py-12 mt-12 border-t border-gray-200">
          <p className="text-gray-700 text-lg mb-3 font-medium">
            辞書や単語が足りない？
          </p>
          <p className="text-gray-600 text-base mb-4">
            Pull Request での追加・修正を歓迎しています！
          </p>
          <p className="text-gray-500 text-sm">
            <a
              href="https://github.com/pokutuna/dictionary.vcf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline font-medium"
            >
              <Github size={16} />
              GitHub リポジトリはこちら
              <ExternalLink size={14} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
