"use server";

import { revalidatePath } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author) {
    return {
      status: false,
      error: "리뷰 내용과 빈칸을 모두 채워주세요.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({ bookId, content, author }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // revalidatePath 검증 방식

    // 1. revalidatePath(’/book’, “page”);페이지만 재겅증
    // 2. revalidatePath(’/book/[id]’, “page”); - 특정 경로의 모든 동적 페이지를 재검증
    // 3. revalidatePath(’/with-searchbar)’,”layout”) - 특정 레이아웃을 갖는 모든 페이지 재검증
    // 4. revalidatePath(”/”, “layout”) -  모든 데이터 재검증
    // 5. revalidateTag(”tag”) - 태그 기준, 데이터 재검증
    revalidatePath(`/book/${bookId}`);
    return {
      status: true,
      error: "",
    };
  } catch (error) {
    return {
      status: false,
      error: "리뷰 작성에 실패했습니다.",
    };
  }
}
