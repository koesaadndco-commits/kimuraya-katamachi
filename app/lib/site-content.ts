import { FILE_PREFIX, kv } from "./staff-store";

// ホームページの「写真・文章」を、スタッフ管理画面（/staff/site）から差し替えるための定義。
// ここに無い場所（ヒーロー＝オープニング映像と最初の大きな映像の部分など）は編集できない。
// 既定値（default）は、いまのホームページに書かれている内容。差し替えが無ければ既定値を表示する。

export type FieldType = "text" | "textarea" | "image";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  /** 文章はそのまま、写真は /img/... のパス。改行は \n */
  default: string;
  help?: string;
};

export type Section = {
  id: string;
  title: string;
  /** true のものは画面に表示するだけで編集できない */
  locked?: boolean;
  note?: string;
  fields: Field[];
};

const T = (key: string, label: string, def: string, help?: string): Field => ({ key, label, type: "text", default: def, help });
const A = (key: string, label: string, def: string, help?: string): Field => ({ key, label, type: "textarea", default: def, help });
const I = (key: string, label: string, def: string, help?: string): Field => ({ key, label, type: "image", default: def, help });

const BR = "改行した位置で、ホームページでも改行されます。";
const MK = "《 》で囲んだ言葉には金色の下線が付きます。";

export const SECTIONS: Section[] = [
  {
    id: "hero",
    title: "ヒーロー（オープニング映像・最初の大きな映像）",
    locked: true,
    note: "ホームページの顔になる部分のため、ここは管理画面からは変更できません（ロック中）。変更が必要なときは制作担当にご連絡ください。",
    fields: [],
  },
  {
    id: "promise",
    title: "私たちの約束（OUR PROMISE）",
    fields: [
      A("promise.text", "本文", "「おいしかったよ」のひとことのために、《今日も朝いちばんに》売り場に立つ。私たちが販売しているのは、食材だけではありません。食事の時間に《自然と出る笑顔》。そして会話です。", MK),
      T("promise.signLabel", "理念の見出し", "経営理念"),
      T("promise.sign", "理念", "食を通じて、ありがとうの溢れる豊かな社会を実現する"),
      I("promise.img", "写真", "/img/morning.jpg"),
      T("promise.caption", "写真の説明", "開店前の青果売り場"),
    ],
  },
  {
    id: "story",
    title: "80年の物語（OUR STORY）",
    note: "年表の年（昭和21年など）と、カードの数・並びは変更できません。",
    fields: [
      T("story.heading", "見出し", "木村屋から、ハニー食彩館へ。"),
      I("story.1.img", "1946年 写真", "/img/old-shop.jpg"),
      T("story.1.title", "1946年 見出し", "食料品店「木村屋」創業"),
      A("story.1.text", "1946年 説明", "戦後の福井で、町の人の暮らしを支える小さな店として始まりました。"),
      I("story.2.img", "1965年 写真", "/img/history/1965-katamachi-rooftop.jpg"),
      T("story.2.title", "1965年 見出し", "株式会社片町フードセンター設立"),
      A("story.2.text", "1965年 説明", "片町に店を構え、対面販売からセルフサービスのスーパーマーケットへ。"),
      I("story.3.img", "1971年 写真", "/img/history/1971-matsumoto.jpg"),
      T("story.3.title", "1971年 見出し", "株式会社松本フードセンター設立"),
      A("story.3.text", "1971年 説明", "地域に根ざした店づくりを広げていきました。"),
      I("story.4.img", "1983年 写真", "/img/hands.jpg"),
      T("story.4.title", "1983年 見出し", "株式会社キムラフーズ設立"),
      A("story.4.text", "1983年 説明", "惣菜と精肉を自社で供給。手づくりの味を毎日の食卓へ。"),
      I("story.5.img", "1986年 写真", "/img/history/store-asuwa.jpg"),
      T("story.5.title", "1986年 見出し", "ハニー足羽店 開店"),
      A("story.5.text", "1986年 説明", "大宮店（昭和52年）・四ツ居店（昭和55年）に続き、「ハニー」の店舗が福井の町に広がっていきます。"),
      I("story.6.img", "1998年 写真", "/img/history/store-mikuni.jpg"),
      T("story.6.title", "1998年 見出し", "「食彩館」の時代へ"),
      A("story.6.text", "1998年 説明", "ハニー食彩館みくにをオープン。丸岡・四ツ居・大宮・東部と、食彩館への生まれ変わりが続きます。"),
      I("story.7.img", "2026年 写真", "/img/register.jpg"),
      T("story.7.title", "2026年 見出し", "創業80年。次の100年へ。"),
      A("story.7.text", "2026年 説明", "経営力・管理者力・現場力。三位一体で、100年ビジョンの実現へ歩みます。"),
    ],
  },
  {
    id: "fukui",
    title: "福井の恵み（スクロールで切り替わる3枚）",
    fields: [
      I("fukui.1.img", "1枚目 写真", "/img/fields.jpg"),
      T("fukui.1.title", "1枚目 見出し", "九頭竜の、田んぼから。"),
      A("fukui.1.sub", "1枚目 説明", "福井の恵みを知りつくした目利きが、\n毎朝売り場に並べます。", BR),
      I("fukui.2.img", "2枚目 写真", "/img/crab.jpg"),
      T("fukui.2.title", "2枚目 見出し", "越前の、海から。"),
      A("fukui.2.sub", "2枚目 説明", "港から、その日のうちに。\n越前の海の幸を、いちばん近くで。", BR),
      I("fukui.3.img", "3枚目 写真", "/img/table.jpg"),
      T("fukui.3.title", "3枚目 見出し", "そして、あなたの食卓へ。"),
      A("fukui.3.sub", "3枚目 説明", "キムラフーズの手づくり惣菜と一緒に、\n今日の「いただきます」を。", BR),
    ],
  },
  {
    id: "goods",
    title: "おすすめ（4つのカード）",
    fields: [
      I("goods.1.img", "1つ目 写真", "/img/crab.jpg"),
      T("goods.1.title", "1つ目 見出し", "越前の鮮魚"),
      T("goods.1.sub", "1つ目 説明", "港から、その日のうちに"),
      I("goods.2.img", "2つ目 写真", "/img/sozai-real.jpg"),
      T("goods.2.title", "2つ目 見出し", "手づくり惣菜"),
      T("goods.2.sub", "2つ目 説明", "キムラフーズの台所から"),
      I("goods.3.img", "3つ目 写真", "/img/hors-doeuvre.jpg"),
      T("goods.3.title", "3つ目 見出し", "特製オードブル"),
      T("goods.3.sub", "3つ目 説明", "ネット予約［準備中］"),
      I("goods.4.img", "4つ目 写真", "/img/fukui-gift.jpg"),
      T("goods.4.title", "4つ目 見出し", "ふくいの贈りもの"),
      T("goods.4.sub", "4つ目 説明", "オンラインショップ［準備中］"),
    ],
  },
  {
    id: "dinner",
    title: "エリちゃんの今日のレシピ",
    note: "「エリちゃんの今日のレシピ」を公開すると、いちばん新しいレシピがここに表示されます。まだ1件も無い間は、気分ボタンで献立を選ぶ見本が表示されます（献立の中身はここでは変更できません）。",
    fields: [
      A("dinner.heading", "見出し", "エリちゃんの今日のレシピ", BR),
      A("dinner.lead", "説明", "食彩館のエリちゃんが、お店でそろう材料でつくれる今日のおすすめレシピをご紹介します。毎日の「今日なににしよう？」に、いちばん近い台所から。"),
    ],
  },
  {
    id: "message",
    title: "社長メッセージ",
    fields: [
      I("message.img", "写真", "/img/president-smile.webp"),
      T("message.videoUrl", "動画のURL（YouTube）", "", "社長メッセージ動画のYouTubeのURL。空欄のあいだは、動画の再生ボタンを表示しません。"),
      T("message.videoTitle", "動画の題名", "社長メッセージ　令和8年9月号"),
      A("message.quote", "メッセージ（大きな文字）", "お客様、社員さん、取引業者さん、\nそして地域のみなさまから\n喜ばれる店でありたい。", BR),
      A("message.body", "本文", "当社は食料品木村屋として創業以来、この想いで商いを続けてきました。「食」という普遍的なテーマを、時代の変化に合わせて追求し続けます。"),
      T("message.title", "肩書き", "代表取締役社長"),
      T("message.name", "お名前", "木村 博常"),
    ],
  },
  {
    id: "people",
    title: "スタッフ（PEOPLE）",
    fields: [
      A("people.heading", "見出し", "売り場には、\n活躍できる環境が用意されている。", BR),
      I("people.1.img", "写真1", "/img/register.jpg"),
      I("people.2.img", "写真2", "/img/hands.jpg"),
      I("people.3.img", "写真3", "/img/morning.jpg"),
      A("people.v1.text", "スタッフの声1", "落ち込む日もあるけれど、その何倍もの「ありがとう」で、また笑顔になれるんです。"),
      T("people.v1.who", "スタッフの声1 担当・入社年", "レジチーフ ／ 平成22年入社"),
      A("people.v2.text", "スタッフの声2", "仕入れた野菜を、次の日に「おいしかった」と言ってもらえた。やっててよかった、と思いました。"),
      T("people.v2.who", "スタッフの声2 担当・入社年", "青果チーフ ／ 平成8年入社"),
      A("people.v3.text", "スタッフの声3", "一品一品に愛情をこめて。気軽に声をかけてくださいね。"),
      T("people.v3.who", "スタッフの声3 担当・入社年", "惣菜担当 ／ 平成20年入社"),
      A("people.v4.text", "スタッフの声4", "お客様の「おはようございます」や「いつも大変だね」の声に、毎日励まされています。"),
      T("people.v4.who", "スタッフの声4 担当・入社年", "店長 ／ 平成12年入社"),
      A("people.v5.text", "スタッフの声5", "頑張った分だけ売上が伸びる。売り場づくりには、とてもやりがいがあります。"),
      T("people.v5.who", "スタッフの声5 担当・入社年", "副店長 ／ 平成22年入社"),
      A("people.v6.text", "スタッフの声6", "良い商品と笑顔の接客で、地域のお客様に喜んでいただけることがやりがいです。"),
      T("people.v6.who", "スタッフの声6 担当・入社年", "パン担当・レジチーフ ／ 平成26年入社"),
    ],
  },
  {
    id: "stores",
    title: "店舗一覧（STORES）",
    note: "店舗の住所・電話・営業時間は、ここでは変更できません。",
    fields: [
      A("stores.heading", "見出し", "いつもの店が、\nあなたの近くに。", BR),
      T("stores.lead", "説明", "すべて年中無休。いまの営業状況を表示しています。"),
    ],
  },
  {
    id: "memories",
    title: "思い出（YOUR MEMORIES）",
    fields: [
      A("memories.heading", "見出し", "あなたの\n「食彩館の思い出」を\n聞かせてください。", BR),
      A("memories.lead", "説明", "母と通った片町フードセンター。部活帰りのコロッケ。はじめてのおつかい。80年のあいだに、この町の人たちとつくってきた思い出を、次の世代へつなぎます。"),
    ],
  },
  {
    id: "news",
    title: "お知らせ・ブログ（NEWS & JOURNAL）",
    fields: [T("news.heading", "見出し", "お店から、今日のたより。")],
  },
  {
    id: "recruit",
    title: "採用（RECRUIT）",
    fields: [
      I("recruit.img", "写真", "/img/team-recruit.jpg"),
      A("recruit.heading", "見出し", "「ありがとう」を、\n仕事にしよう。", BR),
      A("recruit.text", "説明", "「また明日ね」と笑顔で言い合える職場を、一緒につくりませんか。新卒正社員・中途正社員・パート・アルバイトを募集しています。"),
    ],
  },
  {
    id: "finale",
    title: "いちばん下（今日も、いただきます。）",
    note: "背景の映像は変更できません。写真は映像が始まる前と、映像を再生できない環境で表示されます。",
    fields: [
      I("finale.img", "写真", "/img/family.jpg"),
      A("finale.heading", "見出し", "今日も、\nいただきます。", BR),
      A("finale.text", "説明", "八十年分の「ありがとう」をこめて。これからも、福井の台所であり続けます。"),
    ],
  },  {
    id: "recruitpage",
    title: "採用ページの動画（MOVIE）",
    note: "YouTube の動画URLを貼ると、採用ページ（/recruit）の「MOVIE」欄に埋め込まれます。1本も無いときは、創業八十周年記念映像を表示します。",
    fields: [
      A("rv.lead", "MOVIE の説明", "売り場の毎日、先輩たちの声、木村グループの80年。動画で、私たちの仕事をのぞいてみてください。"),
      T("rv.1.url", "動画1 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.1.title", "動画1 タイトル", ""),
      T("rv.2.url", "動画2 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.2.title", "動画2 タイトル", ""),
      T("rv.3.url", "動画3 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.3.title", "動画3 タイトル", ""),
      T("rv.4.url", "動画4 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.4.title", "動画4 タイトル", ""),
      T("rv.5.url", "動画5 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.5.title", "動画5 タイトル", ""),
      T("rv.6.url", "動画6 URL", "", "YouTube の動画ページのURL（例：https://www.youtube.com/watch?v=…）を貼ってください。空欄なら表示されません。"),
      T("rv.6.title", "動画6 タイトル", ""),
    ],
  },
];

export const ALL_FIELDS: Field[] = SECTIONS.flatMap((s) => s.fields);
const FIELD_BY_KEY = new Map(ALL_FIELDS.map((f) => [f.key, f]));

export function fieldOf(key: string): Field | undefined {
  return FIELD_BY_KEY.get(key);
}

const CONTENT_KEY = "site:content";

export type ContentMap = Record<string, string>;

/** 差し替え済みの内容（差し替えていない項目は含まない） */
export async function loadOverrides(): Promise<ContentMap> {
  try {
    const store = await kv();
    if (!store) return {};
    return (await store.get<ContentMap>(CONTENT_KEY, "json")) ?? {};
  } catch {
    // KV が使えない環境（ビルド時など）でも、既定の内容で表示できるようにする
    return {};
  }
}

/** 表示用：差し替えがあればそれを、無ければ既定値を返す */
export function contentGetter(overrides: ContentMap) {
  return (key: string): string => {
    const f = FIELD_BY_KEY.get(key);
    const v = overrides[key];
    if (v !== undefined && v !== "") return v;
    return f?.default ?? "";
  };
}

/**
 * 1つのセクションの内容を保存する。
 * texts: 文章（既定値と同じなら差し替えを消す）／ images: 新しい写真／ resets: 既定に戻す項目
 */
export async function saveSection(
  sectionId: string,
  texts: Record<string, string>,
  images: Record<string, { bytes: ArrayBuffer; name: string; type: string }>,
  resets: string[],
): Promise<void> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section || section.locked) throw new Error("locked or unknown section");
  const allowed = new Set(section.fields.map((f) => f.key));

  const current = (await store.get<ContentMap>(CONTENT_KEY, "json")) ?? {};
  const next: ContentMap = { ...current };
  const oldFiles: string[] = [];
  const fileIdOf = (v: string | undefined) => (v && v.startsWith("/f/") ? v.slice(3) : null);

  for (const [key, value] of Object.entries(texts)) {
    const f = FIELD_BY_KEY.get(key);
    if (!f || !allowed.has(key) || f.type === "image") continue;
    const v = value.replace(/\r\n?/g, "\n").trim();
    if (!v || v === f.default) delete next[key];
    else next[key] = v;
  }

  for (const key of resets) {
    const f = FIELD_BY_KEY.get(key);
    if (!f || !allowed.has(key)) continue;
    const old = fileIdOf(next[key]);
    if (old) oldFiles.push(old);
    delete next[key];
  }

  for (const [key, file] of Object.entries(images)) {
    const f = FIELD_BY_KEY.get(key);
    if (!f || !allowed.has(key) || f.type !== "image" || resets.includes(key)) continue;
    const id = crypto.randomUUID();
    await store.put(FILE_PREFIX + id, file.bytes, { metadata: { type: file.type, name: file.name } });
    const old = fileIdOf(next[key]);
    if (old) oldFiles.push(old);
    next[key] = `/f/${id}`;
  }

  await store.put(CONTENT_KEY, JSON.stringify(next));
  // 新しい内容を保存できてから、使わなくなった写真を消す
  for (const id of oldFiles) await store.delete(FILE_PREFIX + id);
}
