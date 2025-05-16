"use client";

import { useActionState, useEffect } from "react";
import style from "./review-editor.module.css";
import { createReviewAction } from "@/actions/create-reviwe.action";

// 2번째인자 상태 초기값

export function ReviewEditor({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );
  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);
  return (
    <section>
      <form action={formAction} className={style.form_container}>
        <input
          type="text"
          name="bookId"
          value={bookId}
          placeholder="책 ID"
          hidden
          readOnly
        />
        <textarea
          disabled={isPending}
          required
          name="content"
          placeholder="리뷰 내용"
        />

        <div className={style.submit_container}>
          <input
            disabled={isPending}
            required
            type="author"
            placeholder="작성자"
          />
          <button disabled={isPending} type="submit">
            {isPending ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
