import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./searchable-layout.module.css";
export default function SearchableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const q = router.query.q;

  useEffect(() => {
    setSearch(q as string);
  }, [q]);
  // e는 React에서 ChangeEvent에서 발생한 타입인데 어떤 태그에서 발생한거냐면 HTML에 InputElement에서 발생한거다.
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    // 검색어를 입력했을 때 검색어를 콘솔에 출력한다.
    // 검색어가 없거나 현재 검색어와 같으면 아무것도 하지 않는다.
    if (!search || q === search) return;
    router.push(`/search?q=${search}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키를 눌렀을 때 검색어를 콘솔에 출력한다.
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  return (
    <div>
      <div className={styles.searchbar_container}>
        <input
          onChange={onChange}
          type="text"
          placeholder="검색어를 입력하세요 ..."
          onKeyDown={onKeyDown}
        />
        <button onClick={onSubmit}>검색</button>
      </div>
      {children}
    </div>
  );
}

SearchableLayout.getLayout = function getLayout(page: React.ReactNode) {
  return <div>odkgokdogsk{page}</div>;
};
// getLayout을 사용하여 페이지를 감싸는 레이아웃을 설정한다.
