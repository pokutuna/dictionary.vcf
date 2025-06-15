import {
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";
import { useMemo } from "react";
import type { Dictionary, DictionaryEntry, Category } from "./dictionary";

export { Modal } from "./components/Modal";
export { InstructionModal } from "./components/InstructionModal";

function generateRandomWords(dict: Dictionary): string[] {
  if (dict.entries.length === 0) return [];
  
  const shuffled = [...dict.entries].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, 10).map(e => e.word);
}

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">辞書を読み込み中...</p>
      </div>
    </div>
  );
}

interface StatsDisplayProps {
  selectedCount: number;
  totalSelectedEntries: number;
}

export function StatsDisplay({
  selectedCount,
  totalSelectedEntries,
}: StatsDisplayProps) {
  return (
    <div className="text-sm text-gray-600">
      {selectedCount} 個の辞書を選択 • {totalSelectedEntries} 個の単語を選択
    </div>
  );
}


interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-2">
      <h2 className="text-lg font-semibold text-gray-900">
        {category.name}
        <span className="text-sm text-gray-600 font-normal ml-2">
          {category.description}
        </span>
      </h2>
    </div>
  );
}

interface DictionaryEntryComponentProps {
  entry: DictionaryEntry;
  dictName: string;
  index: number;
  onToggle: (dictName: string, entryId: string) => void;
  onUpdateReading: (
    dictName: string,
    entryId: string,
    newReading: string
  ) => void;
}

export function DictionaryEntryComponent({
  entry,
  dictName,
  index,
  onToggle,
  onUpdateReading,
}: DictionaryEntryComponentProps) {
  const isModified = entry.reading !== entry.originalReading;
  const isEven = index % 2 === 0;

  return (
    <div className={`flex items-center gap-3 p-2 rounded ml-11 ${isEven ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <input
        type="checkbox"
        checked={entry.selected}
        onChange={() => onToggle(dictName, entry.id)}
        className="h-4 w-4 text-blue-600 rounded border-gray-300 flex-shrink-0 self-center"
      />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0 items-center">
        <div className="font-mono text-sm font-medium truncate self-center">
          {entry.word}
        </div>

        <div className="relative self-center">
          <input
            type="text"
            value={entry.reading}
            onChange={(e) =>
              onUpdateReading(dictName, entry.id, e.target.value)
            }
            className={`text-sm border rounded px-2 py-1 pr-8 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isModified ? "border-orange-300 bg-orange-50" : "border-gray-300"
            }`}
            placeholder="読み仮名"
          />
          {isModified && (
            <Edit3
              size={14}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface DictionaryCardProps {
  dict: Dictionary;
  isExpanded: boolean;
  onToggleDictionary: (name: string) => void;
  onToggleExpanded: (name: string) => void;
  onToggleEntry: (dictName: string, entryId: string) => void;
  onUpdateReading: (
    dictName: string,
    entryId: string,
    newReading: string
  ) => void;
}

export function DictionaryCard({
  dict,
  isExpanded,
  onToggleDictionary,
  onToggleExpanded,
  onToggleEntry,
  onUpdateReading,
}: DictionaryCardProps) {
  const randomWords = useMemo(() => generateRandomWords(dict), [dict.name, dict.entries.length]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8">
            <input
              type="checkbox"
              checked={dict.selected}
              onChange={() => onToggleDictionary(dict.name)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
            onClick={() => onToggleExpanded(dict.name)}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {dict.displayName}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {dict.entries.length}語
                  </span>
                </div>

                <div className="text-xs text-gray-600 truncate">
                  {randomWords.join(", ")}
                  {dict.entries.length > 10 && ", ..."}
                </div>
              </div>

              <div className="flex-shrink-0 ml-2">
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {dict.entries.map((entry, index) => (
                <DictionaryEntryComponent
                  key={entry.id}
                  entry={entry}
                  dictName={dict.name}
                  index={index}
                  onToggle={onToggleEntry}
                  onUpdateReading={onUpdateReading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
