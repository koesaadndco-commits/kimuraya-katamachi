"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="st-btn primary" disabled={pending}>
      {pending ? "保存中…（そのままお待ちください）" : "この内容でホームページに反映する"}
    </button>
  );
}
