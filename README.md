# Backlog to GFM Markdown Migration Tool

Backlog の Markdown を GitHub Flavored Markdown の見出しに変換するツールです。
指定したプロジェクトの課題概要および Wiki のデータを一括で変換します。

Backlog の Markdown は `#Title` を見出しとして解釈していました。
GitHub Flavored Markdown は見出しとして解釈しないため `# Title` に修正します。

## 使い方

1. **実行ファイルをダウンロード**
   - [Releases](https://github.com/tsuyoshizawa/migrate-blg-gfm-markdown/releases) より最新版の実行ファイルをダウンロードします
      - Windows: `migrate-blg-gfm-win.exe`
      - macOS: `migrate-blg-gfm-macos`

2. **実行**
   - コマンドプロンプトからダウンロードしたファイルを実行します

3. **設定入力**
   - Backlog スペース（例：`yourspace.backlog.com`）
   - API キー
   - プロジェクトコード
   - ドライランモード（Y/n）

## API キーの取得方法

1. Backlog にログインする
2. 個人設定ページから API ページを開く
3. API キーを生成する

## ドライランモード

**推奨**: 初回実行時はドライランモード（Y）を選択してください。

- **ドライランモード（Y）**: 変更内容をプレビューのみ（実際の更新は行わない）
- **実行モード（N）**: 実際に Backlog を更新

## ログ

実行結果は`migration.log`ファイルに保存されます。

## 注意事項

このツールは十分な検証を行っていますが、**万が一問題が発生した場合の保証はできません**。

- **ドライランモードで事前確認**してください
- 自己責任でご利用ください

---

## 開発者向け情報

### 要件

- Node.js 22 以上
- Backlog API キー

### インストール

```bash
npm install
```

### 開発モード

```bash
npm run dev
```

### ビルド

```bash
npm run build
npm start
```

### 実行ファイル作成

GitHub Actions でタグをつけたときに自動的に Windows/macOS 用の実行ファイルが作成されます。
