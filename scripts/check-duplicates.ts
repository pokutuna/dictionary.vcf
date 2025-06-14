#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface DictionaryEntry {
  word: string;
  reading: string;
  file: string;
}

interface DuplicateGroup {
  word: string;
  entries: DictionaryEntry[];
}

function loadDictionary(filePath: string): DictionaryEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.csv');
  const entries: DictionaryEntry[] = [];
  
  const lines = content.trim().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      const [word, reading] = line.split(',');
      if (word && reading) {
        entries.push({
          word: word.trim(),
          reading: reading.trim(),
          file: fileName
        });
      }
    }
  }
  
  return entries;
}

function findDuplicates(): DuplicateGroup[] {
  const dictionariesDir = path.join(process.cwd(), 'dictionaries');
  const files = fs.readdirSync(dictionariesDir)
    .filter(file => file.endsWith('.csv') && file !== 'list.json');
  
  const allEntries: DictionaryEntry[] = [];
  
  // すべての辞書ファイルを読み込み
  for (const file of files) {
    const filePath = path.join(dictionariesDir, file);
    const entries = loadDictionary(filePath);
    allEntries.push(...entries);
  }
  
  // 単語ごとにグループ化
  const wordGroups = new Map<string, DictionaryEntry[]>();
  
  for (const entry of allEntries) {
    const normalizedWord = entry.word.toLowerCase();
    if (!wordGroups.has(normalizedWord)) {
      wordGroups.set(normalizedWord, []);
    }
    wordGroups.get(normalizedWord)!.push(entry);
  }
  
  // 重複を見つける（2つ以上のファイルに存在する単語）
  const duplicates: DuplicateGroup[] = [];
  
  for (const [word, entries] of wordGroups) {
    if (entries.length > 1) {
      // 同じファイル内での重複は除外（これは別の問題）
      const uniqueFiles = new Set(entries.map(e => e.file));
      if (uniqueFiles.size > 1) {
        duplicates.push({
          word,
          entries: entries.sort((a, b) => a.file.localeCompare(b.file))
        });
      }
    }
  }
  
  return duplicates.sort((a, b) => a.word.localeCompare(b.word));
}

function checkSameFileDuplicates(): { file: string; duplicates: string[] }[] {
  const dictionariesDir = path.join(process.cwd(), 'dictionaries');
  const files = fs.readdirSync(dictionariesDir)
    .filter(file => file.endsWith('.csv') && file !== 'list.json');
  
  const sameFileDuplicates: { file: string; duplicates: string[] }[] = [];
  
  for (const file of files) {
    const filePath = path.join(dictionariesDir, file);
    const entries = loadDictionary(filePath);
    
    const wordCounts = new Map<string, number>();
    for (const entry of entries) {
      const normalizedWord = entry.word.toLowerCase();
      wordCounts.set(normalizedWord, (wordCounts.get(normalizedWord) || 0) + 1);
    }
    
    const duplicates = Array.from(wordCounts.entries())
      .filter(([word, count]) => count > 1)
      .map(([word]) => word)
      .sort();
    
    if (duplicates.length > 0) {
      sameFileDuplicates.push({
        file: path.basename(file, '.csv'),
        duplicates
      });
    }
  }
  
  return sameFileDuplicates;
}

function main() {
  console.log('🔍 辞書の重複チェックを開始します...\n');
  
  // ファイル間重複チェック
  const crossFileDuplicates = findDuplicates();
  
  if (crossFileDuplicates.length > 0) {
    console.log('❌ ファイル間での重複が見つかりました:');
    console.log('=' .repeat(60));
    
    for (const duplicate of crossFileDuplicates) {
      console.log(`\n📝 "${duplicate.word}"`);
      for (const entry of duplicate.entries) {
        console.log(`   ${entry.file}: ${entry.word} → ${entry.reading}`);
      }
    }
    
    console.log(`\n合計 ${crossFileDuplicates.length} 個の重複単語が見つかりました。\n`);
  } else {
    console.log('✅ ファイル間での重複は見つかりませんでした。\n');
  }
  
  // 同一ファイル内重複チェック
  const sameFileDuplicates = checkSameFileDuplicates();
  
  if (sameFileDuplicates.length > 0) {
    console.log('❌ 同一ファイル内での重複が見つかりました:');
    console.log('=' .repeat(60));
    
    for (const fileDup of sameFileDuplicates) {
      console.log(`\n📁 ${fileDup.file}.csv:`);
      for (const word of fileDup.duplicates) {
        console.log(`   - ${word}`);
      }
    }
    
    console.log(`\n${sameFileDuplicates.length} 個のファイルで同一ファイル内重複が見つかりました。\n`);
  } else {
    console.log('✅ 同一ファイル内での重複は見つかりませんでした。\n');
  }
  
  // 統計情報
  const dictionariesDir = path.join(process.cwd(), 'dictionaries');
  const files = fs.readdirSync(dictionariesDir)
    .filter(file => file.endsWith('.csv') && file !== 'list.json');
  
  let totalEntries = 0;
  console.log('📊 統計情報:');
  console.log('=' .repeat(60));
  
  for (const file of files.sort()) {
    const filePath = path.join(dictionariesDir, file);
    const entries = loadDictionary(filePath);
    totalEntries += entries.length;
    console.log(`${path.basename(file, '.csv').padEnd(20)} : ${entries.length.toString().padStart(3)} 単語`);
  }
  
  console.log('─'.repeat(60));
  console.log(`${'合計'.padEnd(20)} : ${totalEntries.toString().padStart(3)} 単語`);
  
  // 終了コード
  const hasAnyDuplicates = crossFileDuplicates.length > 0 || sameFileDuplicates.length > 0;
  if (hasAnyDuplicates) {
    console.log('\n🚨 重複が見つかったため、終了コード 1 で終了します。');
    process.exit(1);
  } else {
    console.log('\n✨ 重複は見つかりませんでした。');
    process.exit(0);
  }
}

main();