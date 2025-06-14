import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import type { Route } from "./+types/home";
import type { Category } from "../dictionary";
import { generateVCF, downloadVCF } from "../vcf";
import { getAllDictionaries } from "../dictionary";
import { calculateStats } from "../utils";
import { useDictionaryState } from "../hooks";
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


export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDict, setExpandedDict] = useState<string | null>(null);
  const {
    dictionaries,
    setDictionaries,
    toggleDictionary,
    toggleEntry,
    updateReading,
    selectAll,
    deselectAll,
  } = useDictionaryState([]);

  useEffect(() => {
    const { categories: loadedCategories, dictionaries: loadedDictionaries } = getAllDictionaries();
    setCategories(loadedCategories);
    setDictionaries(loadedDictionaries);
    setLoading(false);
  }, [setDictionaries]);


  const handleGenerateVCF = () => {
    const vcfContent = generateVCF(dictionaries);
    downloadVCF(vcfContent);
  };


  const { selectedCount, totalSelectedEntries, allSelected } = calculateStats(dictionaries);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
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

          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-4">
            💡
            連絡先に含める辞書・単語の選択、音声入力の際のよみがなの編集ができます
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  disabled={allSelected}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span className="text-xs">☑</span>
                  すべて選択
                </button>

                <button
                  onClick={deselectAll}
                  disabled={totalSelectedEntries === 0}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span className="text-xs">☐</span>
                  すべて解除
                </button>
              </div>

              <div className="text-sm text-gray-600">
                <StatsDisplay
                  selectedCount={selectedCount}
                  totalSelectedEntries={totalSelectedEntries}
                />
              </div>
            </div>

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
