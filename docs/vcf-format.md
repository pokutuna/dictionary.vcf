## 出力辞書ファイルの形式

最終的な辞書ファイルを vCard フォーマットで出力します。

```
BEGIN:VCARD
VERSION:3.0
PRODID:dictionary.vcf
N:;;;;
FN:{入力ワード}
ORG:{入力ワード}
X-PHONETIC-ORG:{読み仮名}
X-ABShowAs:COMPANY
NOTE:https://pokutuna.github.io/dictionary.vcf/
END:VCARD
```

### 例: 3つのファイルの例を示します。

```
BEGIN:VCARD
VERSION:3.0
PRODID:dictionary.vcf
N:;;;;
FN:kubernetes
ORG:kubernetes
X-PHONETIC-ORG:クバネテス
X-ABShowAs:COMPANY
NOTE:https://pokutuna.github.io/dictionary.vcf/
END:VCARD

BEGIN:VCARD
VERSION:3.0
PRODID:dictionary.vcf
N:;;;;
FN:sync
ORG:sync
X-PHONETIC-ORG:シンク
X-ABShowAs:COMPANY
NOTE:https://pokutuna.github.io/dictionary.vcf/
END:VCARD

BEGIN:VCARD
VERSION:3.0
PRODID:dictionary.vcf
N:;;;;
FN:git commit
ORG:git commit
X-PHONETIC-ORG:ギットコミット
X-ABShowAs:COMPANY
NOTE:https://pokutuna.github.io/dictionary.vcf/
END:VCARD
```
