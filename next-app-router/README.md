# Next.js App Router 완벽 정리: Page Router에서 App Router로 전환하며 알아야 할 것들

Next.js 13 이후 도입된 **App Router**는 단순한 라우팅 방식의 변화가 아닌, **React 18의 기능을 본격적으로 활용하는 구조적 전환**입니다. 이 글은 기존 Page Router에서 App Router로 전환하며 생긴 변화와 핵심 개념을 실제 코드 예시와 함께 정리한 글입니다.

---

## ✅ App Router 핵심 변화

1. React 18 기능 도입
2. 데이터 페칭 방식 변화
3. 레이아웃 관리 방식 변경
4. 폴더 기반 페이지 라우팅 적용

---

## 📁 레이아웃 구성 방식

App Router에서는 폴더 구조가 곧 URL입니다. 기본적인 구조는 다음과 같습니다.

app/
layout.tsx ← 전체 HTML의 뼈대
page.tsx ← 기본 페이지 컴포넌트
search/
layout.tsx ← /search 경로 전용 레이아웃
setting/
page.tsx ← /search/setting 페이지

- `layout.tsx`는 해당 폴더 하위 모든 페이지에 공통으로 적용됩니다.
- 중첩 레이아웃도 지원됩니다.
- layout이 없으면 Next가 기본 layout을 생성합니다.

---

## 📌 동적 라우팅

- `book/[id]`: `/book/1`, `/book/2`
- `book/[...id]`: `/book/1/1`, `/book/2/1` (세그먼트)
- `book/[[...id]]`: 옵셔널 세그먼트, 루트로 접근 시 404 없음

`searchParams`를 통해 props로 쿼리스트링을 받을 수 있습니다.

---

## 📂 Route Group (라우트 그룹)

경로에 영향을 주지 않는 폴더 그룹입니다.

예시:
app/
(with-searchbar)/
search/
search/setting/

- 소괄호 `()`를 사용합니다.
- 공통 레이아웃을 구성할 때 유용합니다.

---

## 🧠 React Server Component (RSC)

- 서버에서만 실행되는 컴포넌트
- JS 번들 크기를 줄이고 **TTI (Time To Interactive)** 개선
- 클라이언트에서는 Hydration이 필요 없는 컴포넌트는 제외

### ⚠️ 주의사항

- 브라우저 코드 포함 ❌
- 클라이언트 → 서버 컴포넌트 `import` ❌
- 서버 컴포넌트 → 클라이언트 컴포넌트는 OK, 단 **직렬화 불가능한 props 전달 ❌**

> **RSC Payload**: 서버 컴포넌트의 결과물(JSON 형태)

---

## 🚀 Navigation과 Prefetch

- App Router는 RSC Payload와 JS Bundle을 함께 전송
- `next/link` 컴포넌트는 기본적으로 prefetch 적용
- 프로그래매틱 네비게이션: `router.push("/target")`

---

## 📡 데이터 페칭 방식 변화

이전의 `getServerSideProps`, `getStaticProps`는 사라졌고, **fetch API + async/await**로 대체되었습니다.

```tsx
const res = await fetch("https://api.example.com/data", {
  cache: "force-cache",
  next: { revalidate: 10 },
});
const data = await res.json();
```

### 캐시 옵션

| 옵션                   | 설명                             |
| ---------------------- | -------------------------------- |
| `cache: "no-store"`    | 캐시 안 함                       |
| `cache: "force-cache"` | 무조건 캐시                      |
| `next.revalidate`      | 일정 주기로 갱신                 |
| `next.tags`            | ISR 기능을 on-demand로 유사 구현 |

🔁 Request Memoization
서버 렌더링 중 중복 요청을 막기 위한 임시 캐시

페이지 렌더링이 끝나면 캐시 소멸

📦 Full Route Cache
정적 페이지(SSG) 결과를 전체 HTML로 캐시

빌드 시점에 사전 생성

dynamic 조건이 아니면 모두 static으로 간주

export const dynamic = 'force-static';

동적 경로 지원 예시:
export function generateStaticParams() {
return [{ id: "1" }, { id: "2" }];
}

🧭 클라이언트 라우터 캐시
클라이언트가 페이지 이동 시 레이아웃을 재사용

중복된 레이아웃 컴포넌트를 캐싱하여 렌더링 성능 최적화

🌀 Streaming & Loading UI
loading.tsx 파일을 추가하면 스트리밍 방식 적용

빠르게 렌더링 가능한 컴포넌트 먼저 브라우저에 전송

// search/loading.tsx
export default function Loading() {
return <p>로딩 중...</p>;
}

🛠 Error Handling
error.tsx 추가로 특정 영역 에러 처리 가능

서버든 클라이언트든 error.tsx는 적용됨

reset() 함수 제공 → 재렌더 시도 가능

router.refresh()와 함께 사용 권장

onClick={() => {
startTransition(() => {
router.refresh();
reset();
});
}}

9. 서버 액션 (Server Actions)
   함수 하나만으로 서버 액션 가능 → 간단 작업에 최적

클라이언트에 JS 코드 전달하지 않아 보안 우수

서버 전용 코드이므로 클라이언트에서 직접 호출 불가 → 폼 제출 등으로 호출됨

예외 처리는 서버·클라이언트 양쪽에서 해야 함

캐시 무효화: revalidatePath
경로를 지정해 서버에 재생성 요청 → 캐시 무효화

force-cache 하더라도 해당 경로와 관련된 전체 캐시가 무효화됨

새로 생성된 페이지는 다시 풀 라우트 캐시에 저장됨

사용 예시
호출 구문 설명
revalidatePath('/book', 'page') /book 페이지 캐시 재검증
revalidatePath('/book/[id]', 'page') /book 동적 경로 전체 재검증
revalidatePath('/with-searchbar', 'layout') 특정 레이아웃 재검증
revalidatePath('/', 'layout') 전체 데이터 재검증
revalidateTag('tag') 태그 기반 데이터 재검증

10. useActionState
    Server Action 상태를 쉽게 관리하는 React 훅

폼 제출 상태(pending, error, success) 관리 가능

중복 제출 방지, 로딩 UI, 에러 처리에 활용

11. Parallel Routes (병렬 라우트)
    하나의 화면에 여러 페이지를 병렬로 렌더링하는 패턴

예: 소셜 미디어 피드 + 사이드바 동시 렌더링

슬롯(@) 폴더를 사용해 레이아웃에 자동 전달

graphql
복사
app/
├─ @sidebar/
│ └─ page.tsx
├─ @children/
│ └─ page.tsx
└─ layout.tsx
슬롯명과 같은 이름의 props 형태로 부모 레이아웃에 전달됨

12. Intercepting Routes (인터셉팅 라우트)
    특정 경로 요청을 가로채 다른 페이지 렌더링 가능

조건: 클라이언트 사이드 내비게이션 시만 동작

폴더명에 (.) 사용해 원래 경로를 인터셉트함

하위 경로 인터셉트 시 ( .. ) 로 단계별 상위 경로 접근 가능

13. 이미지 최적화
    웹페이지 평균 용량의 58%가 이미지 (http archive 연구)

최적화 필수: WebP, AVIF 변환, 기기 맞춤 이미지 제공, 레이지 로딩, 블러 처리 등

Next.js 자체 이미지 최적화 기능 제공

외부 도메인 이미지 사용 시 next.config.js에 도메인 허용 필요 (보안상 기본 차단)

14. 검색엔진 최적화 (SEO)
    generateMetadata 함수로 동적 메타데이터 생성 가능 (Promise<Metadata> 반환)

tsx
복사
export async function generateMetadata({ id }: { id: string }): Promise<Metadata> {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`);
if (!response.ok) throw new Error(response.statusText);
const book = await response.json();
return {
title: book.title,
description: book.description,
icons: { icon: "/favicon.ico" },
openGraph: {
title: book.title,
description: book.description,
images: book.coverImgUrl,
},
};
}
동일 경로 내 여러 곳에서 API 호출 방지를 위해 Request Memoization으로 한번만 요청 수행

✅ 정리

| 항목         | App Router 특징                                         |
| ------------ | ------------------------------------------------------- |
| 페이지 구성  | 폴더 + `page.tsx`, `layout.tsx`                         |
| 데이터 페칭  | `fetch()` + cache/revalidate                            |
| RSC          | 서버 전용 컴포넌트로 번들 최적화                        |
| 네비게이션   | JS + RSC payload 전달, prefetch 기본 적용               |
| 에러 처리    | `error.tsx`, `reset`, `router.refresh()` 조합           |
| 캐시 전략    | `Full Route Cache`, `Client Router Cache`, `Memo`       |
| Streaming    | `loading.tsx`, 비동기 UI 구성                           |
| Segment 옵션 | `dynamic`, `dynamicParams`, `force-static` 등 설정 가능 |

이 글이 App Router로 마이그레이션하거나 새로운 Next.js 프로젝트를 구축할 때 확실한 기반이 되기를 바랍니다.

---
