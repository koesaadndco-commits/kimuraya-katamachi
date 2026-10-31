import type { ReactNode } from "react";
import { getRole, getStaffPassword, type Role } from "../lib/staff-auth";
import { login } from "./actions";

/** ログイン前なら、ログイン画面（または準備中の画面）を返す。ログイン済みなら役割を返す */
export async function staffGate(opts: { error?: string; next?: string } = {}): Promise<{ screen: ReactNode } | { role: Role }> {
  if (!(await getStaffPassword())) return { screen: <NotConfigured /> };
  const role = await getRole();
  if (!role) return { screen: <Login error={opts.error} next={opts.next} /> };
  return { role };
}

function Logos() {
  return (
    <div className="st-login-logos">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
    </div>
  );
}

function Login({ error, next }: { error?: string; next?: string }) {
  return (
    <div className="st-login-wrap">
      <div className="st-card st-login">
        <Logos />
        <h2>スタッフ専用ページ</h2>
        {error && <div className="st-msg err">{error}</div>}
        <form action={login} className="st-form">
          {next && <input type="hidden" name="next" value={next} />}
          <label>パスワード
            <input type="password" name="password" required autoComplete="current-password" autoFocus />
          </label>
          <div><button type="submit" className="st-btn primary">ログイン</button></div>
        </form>
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="st-login-wrap">
      <div className="st-card st-login">
        <Logos />
        <h2>スタッフ専用ページ（準備中）</h2>
        <p className="st-muted">
          パスワードがまだ設定されていません。Cloudflare ダッシュボードで <code>STAFF_PASSWORD</code> を設定すると使えるようになります（手順は docs/staff-page-setup.md）。
        </p>
      </div>
    </div>
  );
}
