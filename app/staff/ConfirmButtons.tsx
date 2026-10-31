"use client";

import { useEffect } from "react";

/** data-confirm を持つボタンは、押したときに確認ダイアログを出す（削除などの取り消せない操作用） */
export default function ConfirmButtons() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-confirm]");
      if (el && !window.confirm(el.dataset.confirm || "よろしいですか？")) e.preventDefault();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
