import SearchableLayout from "@/components/searchable-layout";
import styles from "./index.module.css";
import BookItem from "@/components/book-item";
import { InferGetStaticPropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

// getServerSideProps는 서버사이드 렌더링을 위한 함수이다.
// 약속된 이름으로, 페이지 컴포넌트와 같은 파일에 export default로 내보내야 한다.
// 동작 방식은 1번으로 url 요청이 들어오면 서버에서 이 함수를 실행하고,
// 그 결과를 props로 페이지 컴포넌트에 전달한다.
export const getStaticProps = async () => {
  console.log("인덱스 페이지");
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);
  return {
    props: {
      allBooks,
      recoBooks,
    },
  };
};

// 클라이언트 컴포넌트는 두번 렌더링된다.
// 서버에서 렌더링된 HTML을 클라이언트에서 다시 렌더링한다.(총 2번)
// 서버에서 렌더링된 HTML을 클라이언트에서 다시 렌더링하는 이유는
// 클라이언트에서 동적으로 변경되는 부분이 있기 때문이다.
export default function Home({
  allBooks,
  recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks.map((book) => (
          // ...book은 전개연산자(spread operator)로 book 객체의 모든 속성을 펼쳐서 전달한다.
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks.map((book) => (
          // ...book은 전개연산자(spread operator)로 book 객체의 모든 속성을 펼쳐서 전달한다.
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

// Home은 함수이고 객체이기 때문에
// getLayout을 Home 객체에 추가할 수  있다.
// getLayout은 페이지를 인자로 받아서 레이아웃을 반환하는 함수이다.
Home.getLayout = function getLayout(page: React.ReactNode) {
  return <SearchableLayout>{page}</SearchableLayout>;
};
