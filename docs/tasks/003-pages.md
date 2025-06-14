react-router-v7 を静的サイトとして GitHub Pages にデプロイせよ

ゴール: 静的サイトとしてビルド & 公開するところまで
コンテンツはデフォルトのままで気にしない

- サイトの作成は React Router v7 を利用する
  - すでにセットアップ済み
  - **注意:** v7 で導入された Framework Mode は、Remix の機能を React Routerに取り入れ、フルスタックアプリケーションの構築を可能にしています
  - フレームワークについて分からないことがあれば DeepWiki MCP で remix-run/react-router リポジトリについて調査する
- `$ npm run build` で静的サイトとしてビルドする
  - 出力は `prerender: true`, `ssr: false` の設定によって静的 & SPA としてビルドされる
  - `build/client` 以下の静的ファイルを GitHub Pages で公開する  
- GitHub Actions ワークフローで公開する
  - 次のドキュメントを参照
    https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E5%85%AC%E9%96%8B%E3%81%99%E3%82%8B%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0-github-actions-%E3%83%AF%E3%83%BC%E3%82%AF%E3%83%95%E3%83%AD%E3%83%BC%E3%81%AE%E4%BD%9C%E6%88%90
