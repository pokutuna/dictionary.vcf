@dictionaries の各辞書ファイルを検証 & 更新するフローを実装作成せよ

- scripts/format.ts を実装する
  - dictionaries/**/*.csv を読み込みフォーマットする
  - 各ファイルを csv の1つ目のフィールドの辞書順にソートして更新
  - `$ npx tsx scripts/format.ts` で実行できるようにする
  - 変更の有無で終了ステータスを変える
- 上記を実行する GitHub Actions ワークフローを実装する
  - push ごとに実行
  - 差分が発生したらコミットする、なければ OK
  - step の name は不要, シンプルな記述に寄せる
