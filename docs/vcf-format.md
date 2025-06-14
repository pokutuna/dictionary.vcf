## 出力辞書ファイルの形式

最終的な辞書ファイルを vCard フォーマットで出力します。

```
BEGIN:VCARD
VERSION:3.0
FN:{入力ワード}
X-PHONETIC-LAST-NAME:{読み仮名, カタカナ}
END:VCARD

```

### 例: 3つのファイルの例を示します。

```
BEGIN:VCARD
VERSION:3.0
FN:kubernetes
X-PHONETIC-LAST-NAME:クバネテス
END:VCARD

BEGIN:VCARD
VERSION:3.0
FN:sync
X-PHONETIC-LAST-NAME:シンク
END:VCARD

BEGIN:VCARD
VERSION:3.0
FN:git commit
X-PHONETIC-LAST-NAME:ギットコミット
END:VCARD
```
