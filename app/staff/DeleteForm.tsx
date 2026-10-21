"use client";

import { removePost } from "./actions";

export default function DeleteForm({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={removePost}
      onSubmit={(e) => {
        if (!confirm(`「${title}」を削除します。よろしいですか？`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="st-del">削除</button>
    </form>
  );
}
