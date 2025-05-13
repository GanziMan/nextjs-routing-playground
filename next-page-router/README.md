# Next.js 13 Page Router 정리

## 1. Page Router란?

- Next.js 전통적 라우팅 시스템
- **`/pages`** 폴더 구조 기반으로 자동 페이지 매핑
- React Router와 유사한 사용성, 안정적이고 익숙한 방식

---

## 2. 기본 페이지 매핑 예시

/pages
├ index.js → “/”
├ about.js → “/about”
└ item.js → “/item”

- 파일명 혹은 폴더명(`about/index.js`) 그대로 URL에 대응
- 폴더 구조만으로 분기 설정이 간편

---

## 3. 동적 라우팅 (Dynamic Routes)

- **단일 파라미터**: `[id].js` → `/book/123`
- **Catch-all**: `[…id].js`
  - `/book/123/456/789` 등 모든 세그먼트를 배열로 받아옴
- **Optional Catch-all**: `[[…id]].js`
  - `/book` 또는 `/book/any/path` 모두 대응

---

## 4. `<Link>` vs `<a>`

- **`<Link>`** 사용 시
  - CSR 전환
  - **자동 프리페칭** (Production 모드에서만)
- **프리페치 비활성화**
  ```jsx
  <Link href="/about" prefetch={false}>
    About
  </Link>
  ```

• 프로그래밍적 프리페칭
useEffect(() => {
router.prefetch('/');
}, []);

5. 프리페칭(prefetching)
   1. TTI(Time to Interactive) 완료 후 실행
   2. 현재 페이지와 연결된 모든 JS 번들을 백그라운드로 미리 로드
   3. 페이지 이동 시 추가 요청 없이 즉시 렌더링
   4. 주의: 개발 모드가 아닌 Production 빌드에서만 동작
   5. <Link> 외의 이동 (router.push) 에는 자동 프리페치 X

⸻

6. 스타일링: CSS 모듈
   • 전역 CSS(import './index.css')는 pages/\_app.js에서만 허용
   • 개별 컴포넌트별로 \*.module.css 사용
   • 클래스명이 자동 고유화되어 충돌 방지

⸻

7. 데이터 페칭 & 사전 렌더링

7.1 React SPA 방식의 한계 1. 컴포넌트 마운트 시점에 fetch 시작 2. 느린 FCP(First Contentful Paint) → 사용자 대기 시간 증가

7.2 Next.js 방식
• SSR (Server-Side Rendering)
• 요청 시마다 서버에서 HTML + 데이터 렌더링
• 함수: export async function getServerSideProps()
• 타입 추론: InferGetServerSidePropsType<typeof getServerSideProps>
• SSG (Static-Site Generation)
• 빌드 타임에 HTML + 데이터 한 번 생성 (getStaticProps)
• 동적 경로: getStaticPaths + fallback 설정

export const getStaticPaths: GetStaticPaths = async () => ({
paths: [
{ params: { id: '1' } },
{ params: { id: '2' } },
],
fallback: false, // 없는 id는 404
});

• ISR (Incremental Static Regeneration)
• On-Demand ISR: 요청 시마다 페이지 재생성
• SSG 속도 + SSR 최신 데이터 반영

⸻

8. Page Router의 단점
   1. 레이아웃 관리 복잡
      • Page.getLayout 등 별도 패턴 필요
   2. 데이터 페칭 집중
      • 페이지 컴포넌트에 페칭 로직 집중 → 하위 전달 번거로움
   3. 불필요한 JS 번들 포함
      • 이벤트 없는 컴포넌트도 하이드레이션 → TTI 지연
      • React Server Component 도입 배경
