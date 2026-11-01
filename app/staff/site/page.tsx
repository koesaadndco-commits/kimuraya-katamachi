import type { Metadata } from "next";
import "../staff.css";
import StaffShell from "../StaffShell";
import { staffGate } from "../gate";
import { SECTIONS, contentGetter, loadOverrides, type Field } from "../../lib/site-content";
import { saveSiteSection } from "./actions";
import ImagePicker from "./ImagePicker";
import SaveButton from "./SaveButton";

export const metadata: Metadata = {
  title: "スタッフ専用｜ホームページの写真・文章",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  role: "ホームページの写真・文章の変更は、管理者のパスワードでログインした人だけができます。",
  locked: "この部分は変更できません（ロック中）。",
  file_type: "写真は JPEG・PNG・WebP のみ使えます。",
  file_size: "写真は 1枚 10MB 以内にしてください。",
};

type Search = Record<string, string | string[] | undefined>;

export default async function SitePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const gate = await staffGate({ next: "/staff/site" });
  if ("screen" in gate) return gate.screen;
  const role = gate.role;

  const error = typeof sp.error === "string" ? ERRORS[sp.error] : undefined;
  const savedId = typeof sp.saved === "string" ? sp.saved : undefined;
  const savedTitle = SECTIONS.find((s) => s.id === savedId)?.title;

  const overrides = await loadOverrides();
  const c = contentGetter(overrides);
  const canEdit = role === "admin";

  return (
    <StaffShell active="site" role={role} crumb="ホームページ ／ 写真・文章の変更">
      <h1>ホームページの写真・文章</h1>
      <p className="st-lead">
        ホームページの各部分の写真と文章を差し替えられます。部分ごとに「この内容でホームページに反映する」を押すと、すぐに切り替わります。
        いちばん上のヒーロー部分（オープニング映像・最初の大きな映像）はロックされていて、変更できません。
      </p>
      {error && <div className="st-msg err">{error}</div>}
      {savedTitle && <div className="st-msg">「{savedTitle}」をホームページに反映しました。</div>}
      {!canEdit && <div className="st-alert">変更は管理者だけができます。いまはスタッフとしてログインしているため、内容の確認のみできます。</div>}

      <nav className="st-site-toc" aria-label="部分の一覧">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}>{s.locked ? "🔒 " : ""}{s.title}</a>
        ))}
      </nav>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className={`st-card st-site-sec${s.locked ? " locked" : ""}`}>
          <h2>{s.locked ? "🔒 " : ""}{s.title}</h2>
          {s.note && <p className="st-help">{s.note}</p>}
          {!s.locked && (
            <form action={saveSiteSection} className="st-form">
              <input type="hidden" name="section" value={s.id} />
              <fieldset disabled={!canEdit} className="st-site-fields">
                {s.fields.map((f) => (
                  <FieldRow key={f.key} field={f} value={c(f.key)} changed={overrides[f.key] !== undefined} />
                ))}
              </fieldset>
              {canEdit && <div className="st-actions"><SaveButton /></div>}
            </form>
          )}
        </section>
      ))}
    </StaffShell>
  );
}

function FieldRow({ field: f, value, changed }: { field: Field; value: string; changed: boolean }) {
  return (
    <div className="st-site-field">
      <div className="st-site-label">
        <span>{f.label}</span>
        {changed && <span className="st-tag ok">変更済み</span>}
      </div>
      {f.type === "image" ? (
        <ImagePicker name={`img:${f.key}`} current={value} label={f.label} />
      ) : f.type === "textarea" ? (
        <textarea name={`txt:${f.key}`} defaultValue={value} rows={Math.min(6, Math.max(2, value.split("\n").length + 1))} />
      ) : (
        <input type="text" name={`txt:${f.key}`} defaultValue={value} />
      )}
      {f.help && <p className="st-help">{f.help}</p>}
      {changed && (
        <label className="st-check small">
          <input type="checkbox" name={`reset:${f.key}`} /> 元の{f.type === "image" ? "写真" : "文章"}に戻す
        </label>
      )}
    </div>
  );
}
