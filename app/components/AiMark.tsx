// ヴィンテージ風の「AI使用マーク」。どのサイト・印刷物でも使えるよう、文字と色は差し替え可能。
// 単体のSVGファイル版：/ai-mark/ai-mark-gold.svg ほか（public/ai-mark/）
type Props = {
  size?: number;
  /** 線と文字の色 */
  color?: string;
  /** リボン内の文字の色（ふつうは背景色） */
  ink?: string;
  /** 上の弧の文字 */
  top?: string;
  /** 下の弧の文字 */
  bottom?: string;
  /** リボンの文字 */
  ribbon?: string;
  className?: string;
};

export default function AiMark({
  size = 96,
  color = "#d9a23b",
  ink = "#1c2839",
  top = "AI ASSISTED",
  bottom = "MADE BY HUMANS WITH AI",
  ribbon = "一部にAIを使用",
  className = "",
}: Props) {
  const id = "aimark";
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`AI使用マーク：${ribbon}`}>
      <defs>
        <path id={`${id}-top`} d="M 31 100 A 69 69 0 0 1 169 100" />
        <path id={`${id}-bot`} d="M 22 100 A 78 78 0 0 0 178 100" />
      </defs>
      <g fill="none" stroke={color}>
        <circle cx="100" cy="100" r="96" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="90" strokeWidth="1" />
        <circle cx="100" cy="100" r="58" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="54" strokeWidth=".8" strokeDasharray="2 3" />
      </g>
      <g fill={color} fontFamily="'Cormorant Garamond', 'Times New Roman', serif" fontWeight="600">
        <text fontSize="17" letterSpacing="5"><textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">{top}</textPath></text>
        <text fontSize="12" letterSpacing="2.6"><textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">{bottom}</textPath></text>
        <text x="100" y="110" fontSize="50" textAnchor="middle" fontStyle="italic" letterSpacing="1">AI</text>
        <path d="M14 100 l5 -4 l5 4 l-5 4 z M176 100 l5 -4 l5 4 l-5 4 z" />
        <path d="M100 52 l2.2 4.6 l5 .7 l-3.6 3.5 l.9 5 l-4.5 -2.4 l-4.5 2.4 l.9 -5 l-3.6 -3.5 l5 -.7 z" />
      </g>
      <g>
        <path d="M52 120 h96 l-7 9 l7 9 h-96 l7 -9 z" fill={color} />
        <text x="100" y="133" fontSize="10" textAnchor="middle" fill={ink} fontFamily="'Zen Kaku Gothic New', 'Hiragino Sans', 'Noto Sans JP', sans-serif" fontWeight="700" letterSpacing="1">{ribbon}</text>
      </g>
    </svg>
  );
}
