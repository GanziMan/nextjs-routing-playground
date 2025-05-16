import BookItem from "@/components/book-item";
import { BookData } from "@/types";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const { q } = searchParams;
  return {
    title: `검색 결과: ${q}`,
    description: `검색어 "${q}"에 대한 검색 결과입니다.`,
    icons: {
      icon: "/favicon.ico",
    },
  };
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`
  );

  if (!response.ok) {
    return <div>에러 발생하였습니다.</div>;
  }
  const books: BookData[] = await response.json();
  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
