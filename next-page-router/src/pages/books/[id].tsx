import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next";
import styles from "./[id].module.css";
import fetchOneBook from "@/lib/fetch-one-book";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: "1" } },
      { params: { id: "2" } },
      { params: { id: "3" } },
    ],
    fallback: "blocking", // 대체, 대비책, 보험  : book이 없는 경우에 대한 대비책
    // 존재하지 않는 id는 404 페이지로 이동한다.
  };
};
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  const book = await fetchOneBook(Number(id));
  return {
    props: { book },
    revalidtate: 10, // 10초마다 재검증한다.
  };
};
export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!book) return "책 정보가 없습니다.";
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;
  return (
    <div className={styles.container}>
      <div
        className={styles.cover_img_container}
        style={{
          backgroundImage: `url(${coverImgUrl})`,
        }}
      >
        <img src={coverImgUrl} alt="" />
      </div>

      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subTitle}</div>
      <div className={styles.author}>
        {author} | {publisher}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
