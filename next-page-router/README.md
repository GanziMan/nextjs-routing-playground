최근 Next.js로 새 프로젝트를 시작하면서 기존 Page Router에서 App Router로 넘어오면서 달라진 점들이 많다는 걸 느꼈습니다.
처음엔 비슷해 보였지만, 구조도 다르고 파일 위치도 다르고, 사용하는 훅이나 메서드까지 꽤 많은 변화가 있더라고요.

현재는 바쁘게 서비스 런칭을 하면서 여유있을때 Nextjs 강의를 들으면서 공부와 놓쳤던 개념들 또는 얇게 알거나 잘못 생각했던 부분들을 바로 잡을 수 있었습니다.

그래서 이번 포스트는
👉 Page Router와 App Router의 차이와 각각의 장단점을 다뤄보려고 합니다. 🥺

## Page Router 기본 개념부터 동적 라우팅, 데이터 페칭, 그리고 한계까지

> Next.js의 Page Router는 많은 기업과 개발자가 안정적으로 사용하는 라우팅 방식입니다. React Router처럼 페이지 단위로 라우팅을 자동으로 처리해주며, pages 폴더 구조를 기반으로 동작합니다.

### Page Router 기본 구조

pages 폴더 내에 파일을 생성하면 자동으로 URL 경로가 매핑됩니다.

예를들자면 다음과 같습니다.

```
pages/
 ├─ index.js        // → "/"
 ├─ about.js        // → "/about"
 ├─ item.js         // → "/mypage"
 └─ about/index.js  // → "/about"
```

- 페이지 이름이 곧 URL 경로가 됩니다.

- 폴더를 만들어 하위 페이지를 구성할 수도 있습니다.

- 동적 라우팅도 간단히 [id].js 같은 파일명으로 구현 가능하며, URL 파라미터를 자동으로 받아옵니다.

### 동적 경로와 Catch-All 세그먼트

#### 기본 동적 라우팅

book/[id].tsx와 같이 파일명에 대괄호 [ ]를 사용하면 id라는 동적 파라미터를 가진 경로가 됩니다.

예: /book/123 → id는 "123"

#### 다중 파라미터 (Catch-All)

여러 경로 세그먼트를 한꺼번에 잡아야 할 때는 Catch-All Segment인 [...id].tsx를 사용합니다.

예: /book/123/1222/555/77 같은 여러 경로 조합을 모두 처리 가능

router.query.id는 배열로 들어옵니다: ["123", "1222", "555", "77"]

하지만 때에 따라 특정 세그먼트가 없어도 페이지를 보여주고 싶은 경우가 있을 수 있습니다.

이 경우에 /book으로 요청하면 어떻게 될까요??

네 404가 발생하게 됩니다. [...id]는 Next js에서 필수 catch-all이라 불러 최소한 하나 이상의 세그먼트가 있어야 합니다.

**그래서 이 부분을 해결하기 위해 생긴 것이 Optional Catch-All Segment 입니다**

#### Optional Catch-All Segment

대괄호를 한번 더 감싸 [[...id]]로 작성하여 경로가 있든 없든 페이지를 대응할 수 있습니다.
/book, /book/123, /book/123/456 모두 대응이 가능합니다.

그래서 상황에 따라 다양하게 경로 처리를 할 수 있습니다.

### 내비게이션과 프리페칭 (Pre-Fetching)

```
Next.js는 기본적으로 <Link> 컴포넌트를 통해 클라이언트 사이드 렌더링을 지원합니다.

- 당연하고 기본적인 이야기지만 <a/> 태그 대신 <Link/>를 사용하는 이유는 새 페이지로 이동할 때 전체 페이지를 다시 로드하지 않고, 클라이언트 내에서 빠르게 전환하기 위함입니다.

- 또한 <a/>는 매번 서버 요청을 발생시키기 때문이에요.
```

**프리페칭 동작 원리**
프리페칭은 사용자가 보고 있는 페이지 내에서 이동 가능성이 있는 높은 모든 링크 페이지들을 미리 페치하여 받아옵니다. 예를 들어, 사진과 같이 대시보드 페이지를 접속 했다면 밑에 Footer 메뉴바에 페이지들을 미리 불러와 딜레이 없이 해당 페이지로 렌더링할 수 있습니다.

![](https://velog.velcdn.com/images/qjatn0955/post/145d8fda-5df2-4581-b9c7-e9d117eebc4a/image.png)

### 주요 데이터 페칭 방식

저는 Next.js를 생각하면 가장먼저 SSR과 SSG가 생각나는 것 같습니다.
가장 메인요소이기도 하고 강력한 페칭 방식이니까요!
어떤 페칭 방식이 있는지 알아보겠습니다.

#### SSR (Server-Side Rendering)

- getServerSideProps 함수를 페이지에서 export

- 매 요청마다 서버에서 렌더링과 데이터 페칭을 수행

- 클라이언트는 서버에서 생성된 HTML을 받아 즉시 볼 수 있음

export const getServerSideProps = async (context) => {
const data = await fetch(...);
return { props: { data } };
};

#### SSG (Static Site Generation)

- 빌드 타임에 정적으로 페이지를 생성

- getStaticProps와 getStaticPaths (동적 경로 시) 사용

export const getStaticPaths = async () => {
return {
paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
fallback: false, // 없으면 404 처리
};
};

export const getStaticProps = async ({ params }) => {
const data = await fetch(...);
return { props: { data } };
};

#### ISR (Incremental Static Regeneration)

- SSG 장점 유지하면서 최신 데이터 반영 가능

- 일정 시간마다 또는 On-Demand로 페이지를 다시 생성

- 예를 들어, revalidate 옵션 설정 시:

export const getStaticProps = async () => {
return {
props: {...},
revalidate: 10, // 10초마다 페이지 재생성
};
};

On-Demand ISR은 외부 요청에 따라 즉시 페이지 재생성 가능 (API 호출 등으로 트리거)

#### Page Router의 단점

페이지별 레이아웃 관리 복잡
레이아웃을 분리하기 어렵고 Page.getLayout 패턴 등으로 우회해야 하는 경우가 많음.

데이터 페칭 집중 문제
페이지 컴포넌트에 데이터가 집중되면서 자식 컴포넌트까지 props 전달이 번거로움. 상태 관리 라이브러리(Redux, Recoil 등)가 도움 되지만 추가 학습 비용 존재.

불필요한 JS 번들 포함과 하이드레이션 비용
서버에서 렌더링된 페이지는 클라이언트에서 하이드레이션 과정을 거치는데, 이때 상호작용이 필요 없는 컴포넌트들도 모두 번들에 포함되고 두 번 렌더링됨으로써 TTI(Time To Interactive)가 늦어지는 문제가 발생함.
→ 이 문제를 해결하고자 Next.js는 React Server Component(RSC)를 도입 중이며, RSC는 클라이언트 이벤트 전달 제한 등 차이점이 있음

#### 끝으로...

Next.js의 Page Router는 강력하고 익숙한 라우팅 방식으로, 기본적인 페이지 네비게이션과 데이터 페칭을 손쉽게 구현할 수 있습니다. 다만, 동적 라우팅의 세밀한 제어, 사전 렌더링 전략의 적절한 선택, 그리고 페이지 구조 최적화를 위해서는 상세한 이해와 경험이 필요합니다.

이후 Next.js의 App Router 등장으로 페이지 라우팅 및 데이터 페칭 패턴이 변화하고 있지만, Page Router는 여전히 안정적이고 많은 프로젝트에서 핵심 역할을 수행하고 있습니다.
