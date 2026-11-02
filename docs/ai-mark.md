# AI使用マーク（ヴィンテージ風）

どのサイト・印刷物でも使える、汎用の「AI使用マーク」。社名などは入れていない。

- ファイル：`public/ai-mark/`（公開URL：`/ai-mark/ai-mark-gold.png` など）
  - 色：gold（金・紺地向け）／navy（紺）／black（黒）／white（白・暗い背景向け）
  - リボン文字：日本語「一部にAIを使用」、`-en` は英語「PARTLY AI-MADE」
  - PNG は 1024×1024・背景透過。SVG は拡大しても劣化しない（文字はフォント指定のため、環境によって書体が変わる場合あり。確実に同じ見た目にしたいときは PNG を使う）
- サイト内では `app/components/AiMark.tsx`（`top` / `bottom` / `ribbon` / `color` で文字と色を変更可能）
- 表示例：「本サイトの一部にAIを使用しています」と文章を添えて使う
