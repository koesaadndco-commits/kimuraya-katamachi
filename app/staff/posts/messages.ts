import { ISSUE_LABEL } from "../../lib/articles";

export const POST_ERRORS: Record<string, string> = {
  notfound: "記事が見つかりませんでした。",
  type: "記事の種類が正しくありません。",
  locked: "公開中の記事は、管理者だけが編集できます。",
  notAdmin: "この操作は管理者だけができます。",
  videoUrl: "動画のURLは http:// または https:// から始めてください。",
  photoType: "写真は JPEG・PNG・WebP のみ登録できます。",
  photoSize: "写真は1枚あたり 10MB 以内にしてください。",
  photoCount: "写真は最大6枚までです。",
};

export function missingText(missing: string): string {
  return missing
    .split(",")
    .map((k) => ISSUE_LABEL[k] ?? k)
    .join("・");
}
