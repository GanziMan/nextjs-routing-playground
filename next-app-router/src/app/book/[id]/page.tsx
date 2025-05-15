import { notFound } from "next/navigation";
import style from "./page.module.css";

// getStaticParams는 getStaticProps와 비슷한 역할을 한다.
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function BookDetail({ id }: { id: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return notFound();
    }
    return <div>에러 발생하였습니다.</div>;
  }

  const book = await response.json();
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}

function ReviewEditor() {
  return <div className={style.reviewEditor}>editor</div>;
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className={style.container}>
      <BookDetail id={id} />
      <ReviewEditor />
    </div>
  );
}
