import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

interface DictionaryEntry {
  word: string;
  reading: string;
}

function parseCsvLine(line: string): DictionaryEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const [word, reading] = trimmed.split(",");
  if (!word || !reading) return null;

  return { word: word.trim(), reading: reading.trim() };
}

function formatCsvContent(content: string): string {
  const lines = content.split("\n");
  const entries: DictionaryEntry[] = [];

  for (const line of lines) {
    const entry = parseCsvLine(line);
    if (entry) {
      entries.push(entry);
    }
  }

  // Sort by word (first column) in dictionary order
  entries.sort((a, b) => a.word.localeCompare(b.word));

  // Format back to CSV
  return (
    entries.map((entry) => `${entry.word},${entry.reading}`).join("\n") + "\n"
  );
}

async function formatDictionaryFiles(): Promise<boolean> {
  const pattern = "dictionaries/**/*.csv";
  const files = await glob(pattern);

  let hasChanges = false;

  for (const file of files) {
    const originalContent = fs.readFileSync(file, "utf-8");
    const formattedContent = formatCsvContent(originalContent);

    if (originalContent !== formattedContent) {
      fs.writeFileSync(file, formattedContent, "utf-8");
      console.log(`Formatted: ${file}`);
      hasChanges = true;
    }
  }

  if (!hasChanges) {
    console.log("All dictionary files are already properly formatted.");
  }

  return hasChanges;
}

async function main() {
  try {
    const hasChanges = await formatDictionaryFiles();
    process.exit(hasChanges ? 1 : 0);
  } catch (error) {
    console.error("Error formatting dictionary files:", error);
    process.exit(2);
  }
}

// Run main function when script is executed directly
main();
