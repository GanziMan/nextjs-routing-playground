Next.js로 신규 프로젝트를 시작하면서, 기존 **Page Router**에서 **App Router**로 넘어가는 과정을 겪었습니다.

App Router를 먼저 공부해가며 프로젝트를 완성했고, 무사히 서비스도 런칭했습니다.
최대한 Next.js 공식문서를 보면서 이해하면서 서비스도 안정적으로 런칭하였습니다.
하지만 “이걸 더 잘 만들 수 없을까?” 하는 생각이 계속 남았습니다! 🔥🔥

그래서 퇴근 후 짬을 내 Next.js 강의를 들으며,  
그동안 제대로 이해하지 못했던 개념들을 다시 하나씩 정리해나갔습니다.

덕분에 **Page Router와 App Router의 차이점, 각각의 장단점**,  
그리고 이걸 실제 회사 프로젝트에 어떻게 적용할지까지 고민해볼 수 있었습니다.

이번 포스트에서는 두 라우팅 방식의 구조적 차이부터  
데이터 페칭 전략, 고급 기능까지 직접 공부하고 정리한 내용을 공유하려고 합니다.

## Page Router

> Page Router는 많은 기업과 개발자가 안정적으로 사용해 온 라우팅 방식입니다. pages/ 폴더 구조를 라우팅을 합니다.

### 기본 구조

pages/ 폴더에 파일을 생성하면 파일명이 그대로 URL 경로가 됩니다.

```
pages/
 ├─ index.js        // → "/"
 ├─ about.js        // → "/about"
 ├─ item.js         // → "/mypage"
 └─ about/index.js  // → "/about"
```

- 파일 이름이 곧 URL이 되고,

- 하위 폴더를 만들면 계층적 경로도 구성할 수 있으며,

- [id].js 같은 동적 라우팅도 간단히 사용할 수 있습니다.

<br/>

### 동적 라우팅

#### 기본 동적 라우팅

book/[id].tsx와 같이 파일명에 대괄호 [ ]를 사용하면 id라는 동적 파라미터를 가진 경로가 됩니다.

```
pages/book/[id].tsx

```

- URL : /book/123
- router.query.id -> "123" 이 때 type은 **string**

#### Catch-All 세그먼트

여러 경로 세그먼트를 한꺼번에 잡아야 할 때는 Catch-All Segment인 [...id].tsx를 사용합니다.

```
pages/book/[...id].tsx
```

여기서 세그먼트라는 단어가 생소하게 들릴 수 있을 것 같습니다!

📌 **세그먼트(Segment)란?**
세그먼트는 URL 경로를 `/`로 나눈 각각의 조각을 말합니다.

예를 들어, `/book/123/detail`이라는 경로가 있다면:

- `book` → 첫 번째 세그먼트
- `123` → 두 번째 세그먼트
- `detail` → 세 번째 세그먼트

- URL : /book/123/1222/555/77 같은 여러 경로 조합을 모두 처리 가능합니다.

- router.query.id -> ["123", "1222", "555", "77"]

하지만 때에 따라 특정 세그먼트가 없어도 페이지를 보여주고 싶은 경우가 있을 수 있습니다.

이 경우에 /book으로 요청을 할 경우 404가 발생하게 됩니다. [...id]는 Next js에서 필수 catch-all이라 불러 최소한 하나 이상의 세그먼트가 있어야 합니다.

그래서 이 부분을 해결하기 위해 생긴 것이 **Optional Catch-All Segment 입니다**

#### Optional Catch-All 세그먼트

대괄호를 한번 더 감싸 [[...id]]로 작성하여 경로가 있든 없든 페이지를 대응할 수 있습니다.

- /book → []

- /book/123 → ["123"]

- /book/123/456 → ["123", "456"]

[[...id]]를 사용하면 세그먼트가 없어도 404가 발생하지 않습니다.

### 내비게이션과 프리페칭 (Pre-Fetching)

```
Next.js는 기본적으로 <Link> 컴포넌트를 통해 클라이언트 사이드 렌더링을 지원합니다.

<a/> 태그 대신 <Link/>를 사용하는 이유는 새 페이지로 이동할 때 전체 페이지를 다시 로드하지 않고, 클라이언트 내에서 빠르게 전환하기 위함입니다.

또한 <a/>는 매번 서버 요청을 발생시키기 때문이에요.
```

**프리페칭 동작 원리**
Next.js는 사용자가 머무는 페이지에서 **가능성 높은** 링크를 미리 가져와(프리페칭) 클릭했을 때 딜레이 없이 렌더링합니다.
예를 들어, 대시보드 페이지에 접속하면, Footer 메뉴에 있는 링크 대상 페이지들이 백그라운드에서 자동으로 프리페치됩니다. 덕분에 사용자가 클릭했을 때 렌더링 지연 없이 즉시 페이지가 전환됩니다.

![](https://velog.velcdn.com/images/qjatn0955/post/145d8fda-5df2-4581-b9c7-e9d117eebc4a/image.png)

### 주요 데이터 페칭 방식

Next.js를 사용할 때 가장 먼저 떠오르는 게 바로 `SSR(Server-Side Rendering)`과 `SSG(Static Site Generation)`입니다.  
이 두 방식은 Next의 핵심 기능이기도 하고, 성능과 SEO 측면에서도 매우 강력하죠.

아래에서 각각 어떤 방식인지, 언제 사용하는지 살펴보겠습니다.

#### 🟦 SSR (Server-Side Rendering)

SSR은 **매 요청마다 서버에서 HTML을 생성해 반환하는 방식**입니다.  
`getServerSideProps` 함수를 페이지에서 export하면, Next.js가 이를 감지해 서버 사이드 렌더링을 수행합니다.

```
export const getServerSideProps = async (context) => {
  const data = await fetch(...);
  return { props: { data } };
};
```

#### 🟩 SSG (Static Site Generation)

SSG는 빌드 타임에 페이지를 미리 생성해두는 방식입니다.
getStaticProps를 export하면, 해당 페이지는 정적 HTML로 생성되어 배포됩니다.

```
export const getStaticProps = async () => {
  const data = await fetch(...);
  return { props: { data } };
};

```

그런데 동적 경로에선 어떻게 할까요?
`[id].tsx` 같은 파일엔 어떤 id가 올지 미리 알 수 없기 때문에, getStaticPaths로 가능한 id 목록을 지정해줘야 합니다.

```
export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false, // 없는 id는 404 처리
  };
};

```

fallback: false - 404 페이지
fallback: true - id를 받아와 SSR 페이지 렌더링

```
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

```

#### 🟨 ISR (Incremental Static Regeneration)

ISR은 SSG의 한계를 극복하기 위한 기능입니다.
빌드 타임에 페이지를 만들되, 일정 시간마다 자동으로 새로운 정적 페이지로 교체할 수 있습니다.

기존의 SSG 장점을 유지하면서 최신 데이터 반영이 가능하고 일정 시간마다 또는 On-Demand로 페이지를 다시 생성할 수 있습니다.

```
export const getStaticProps = async () => {
  return {
    props: {...},
    revalidate: 10, // 10초마다 페이지 재생성
  };
};
```

#### 🟥 On-Demand ISR (요청 기반 재생성)

On-Demand ISR은 Next.js Revalidation API를 수동으로 호출해서, 특정 페이지만 즉시 재생성할 수 있는 기능입니다.

예: 관리자가 상품 정보를 수정한 후 `/product/123` 페이지만 즉시 반영하고 싶을 때 수동으로 호출해서 특정 페이지를 즉시 재생성을 할 수 있습니다.

일반 ISR이 “정해진 시간마다 자동 재생성”이라면, On-Demand ISR은 “필요한 순간에 내가 지정한 페이지만 바로 재생성”할 수 있다는 게 가장 큰 차이입니다.

### Page Router의 단점

#### 🧱 페이지별 레이아웃 관리 번거로움

Page Router는 `pages/` 폴더 내에서 각 페이지가 완전히 독립적으로 구성됩니다.  
공통 레이아웃을 적용하려면, 각 컴포넌트마다 `getLayout` 함수를 따로 지정해줘야 하죠.

이러한 방식도 좋다고 생각하지만, **레이아웃이 변경되면 모든 페이지를 일일이 수정해야 하는** 번거로움이 있습니다.

```
// pages/_app.js
function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  return getLayout(<Component {...pageProps} />);
}
export default MyApp;


// pages/dashboard/index.tsx
DashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};


// pages/dashboard/settings.tsx
SettingsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};


```

#### 📦 props 드릴링

Page Router에선 데이터 페칭이 보통 페이지 단에서 이루어지다 보니,
하위 컴포넌트로 데이터를 전달하려면 계속 props로 넘겨줘야 하는 구조가 됩니다.

Redux, Recoil 같은 상태 관리 라이브러리로 어느 정도 해결은 가능하지만,
추가 설정과 보일러플레이트가 필요하다는 점에서 불편함이 있다고 생각합니다.

#### 💥 번들 크기 증가 및 하이드레이션 비용

서버에서 렌더링된 HTML은 클라이언트에서 **하이드레이션(hydration)**을 거쳐야 합니다.
이 과정에서 상호작용(브라우저 이벤트, js 번들러가 들어가는)이 전혀 없는 정적 컴포넌트들까지 모두 자바스크립트 번들에 포함되며,
결국 불필요한 리렌더링과 번들이 커짐에 따라 TTI(Time To Interactive) 지연 문제가 발생할 수 있습니다.

## App Router

App Router는 위 단점을 보완하고 React 18의 기능을 적극 활용하는 새로운 구조입니다. app/ 폴더 기반으로 라우팅과 레이아웃을 관리하고, React Server Component, Streaming, Suspense 등을 지원합니다.

### 핵심 변화

- **React 18 기능 지원**: `Server Components`, `Streaming`, `Suspense`
- **폴더 기반 라우팅**: `app/page.tsx`, `app/layout.tsx`
- **데이터 페칭 방식 변화**: `getServerSideProps` 대신 `fetch()` + 캐시 설정
- **중첩 레이아웃 구조 도입**: 레이아웃 관리가 훨씬 간편
- **로딩/에러 핸들링 표준화**: `loading.tsx`, `error.tsx` 지원

### 폴더 구조 및 라우팅

App Router는 폴더 구조 그 자체가 라우팅 규칙입니다.  
폴더마다 `page.tsx`와 `layout.tsx`를 정의하여 경로와 레이아웃을 구성합니다.

```
app/
├─ layout.tsx        // 전체 사이트 공통 레이아웃 (HTML 뼈대)
├─ page.tsx          // 최상위 루트 페이지 ("/")
├─ search/
│  ├─ layout.tsx     // /search 경로 전용 레이아웃
│  └─ setting/
│     └─ page.tsx    // /search/setting 페이지

```

`layout.tsx`는 해당 폴더 하위의 모든 페이지에 공통 레이아웃을 적용합니다.  
또한, 하위 폴더에도 `layout.tsx`를 추가하면 **중첩 레이아웃** 구성이 가능해집니다.

만약 특정 폴더에 `layout.tsx`가 없으면, Next.js는 자동으로 `app/layout.tsx`를 상위 레이아웃으로 사용합니다.  
이처럼 App Router에서는 레이아웃이 **구조적으로 필수 요소**로 작동합니다.

### 🏃🏻 동적 라우팅

| 경로 표현        | 설명                                    |
| ---------------- | --------------------------------------- |
| `book/[id]`      | `/book/1`, `/book/2` 같은 동적 세그먼트 |
| `book/[...id]`   | 다중 세그먼트: `/book/1/2/3` 등         |
| `book/[[...id]]` | 세그먼트 유무 관계없이 처리             |

App Router에서도 Page Router와 동일한 방식으로 동적 라우팅을 지원합니다.  
다만 구조는 **폴더 기반**으로 변했고, 다음처럼 작성됩니다!

```
pages/post/[id].tsx → app/post/[id]/page.tsx
```

### 🗂 Route Group (라우트 그룹)

Route Group은 실제 URL 경로에는 영향을 주지 않으면서, **레이아웃을 그룹화할 때 사용하는 기능**입니다.

- 폴더명을 `()`로 감싸면 해당 폴더는 라우팅 경로로 인식되지 않습니다.
- 대신 내부에 있는 `layout.tsx`는 그대로 상속됩니다.

```
app/
├─ (admin)/
│ ├─ layout.tsx // 관리 전용 레이아웃
│ └─ dashboard/
│ └─ page.tsx // 실제 경로는 /dashboard
```

### RSC (React Server Component)

RSC는 **서버에서만 실행되는 컴포넌트**입니다.  
상호작용이 필요 없는 컴포넌트를 클라이언트에 자바스크립트로 전송하지 않아도 되기 때문에, **번들 크기 절감**과 **렌더링 성능 개선**에 큰 도움이 됩니다.

기존 Page Router에서는 상호작용이 없는 요소도 모두 번들에 포함되면서,  
TTI(Time To Interactive)가 지연되는 문제가 자주 발생했죠.

하지만 App Router에서는 RSC를 활용해  
**불필요한 JS 전달을 줄이고**, **정적 컴포넌트는 서버에서만 렌더링**할 수 있어 훨씬 최적화되었습니다.

또한 페이지별 데이터 페칭도 `getServerSideProps` 같은 별도 API 없이,  
서버 컴포넌트 안에서 직접 `fetch()`를 사용해 **트리 구조 그대로 간단하게 구현**할 수 있게 되었습니다.

> ⚠️ 주의할 점:
>
> - **서버 컴포넌트는 클라이언트에서 import할 수 없습니다.**
> - 반면 **서버 컴포넌트 내부에서는 클라이언트 컴포넌트를 포함할 수 있습니다.**  
>   이는 서버가 먼저 렌더링되기 때문에 가능한 구조입니다.

### 데이터 페칭

App Router에서는 `getServerSideProps`, `getStaticProps` 등의 함수 대신  
**`fetch()` 함수와 캐시 옵션 조합**으로 데이터 페칭을 제어합니다.

```
const res = await fetch('https://api.example.com/data', {
  cache: 'force-cache',           // 캐시 사용
  next: { revalidate: 10 },       // 10초마다 재생성 (ISR)
});
const data = await res.json();

```

| 옵션                   | 설명                              |
| ---------------------- | --------------------------------- |
| `cache: 'no-store'`    | 매 요청마다 데이터 새로 요청      |
| `cache: 'force-cache'` | 캐시 사용 (기본값)                |
| `next.revalidate`      | 일정 주기마다 페이지 재생성 (ISR) |
| `next.tags`            | 태그 기반 재검증 (on-demand ISR)  |

🧠 캐시 전략 요약

> - **Request Memoization**
>   동일 요청이 여러 번 발생해도, 한 번만 요청하고 재사용합니다.
>   페이지 렌더링이 끝나면 메모리에서 제거됩니다.

- **Full Route Cache**
  특정 경로의 페이지 전체를 서버에서 정적으로 캐시합니다.
  사용자가 해당 페이지를 요청하면 미리 생성된 결과를 즉시 전달해 속도를 높입니다.

### 🌀 로딩 & 에러 처리

App Router는 React의 `<Suspense/>`와 함께 `loading.tsx` 파일을 통해 스트리밍 렌더링을 제공합니다.
이를 통해 일부 페이지 컴포넌트를 먼저 보여주고 나머지를 나중에 렌더링할 수 있어 UX가 개선됩니다.

loading.tsx → Suspense fallback

error.tsx → 컴포넌트 단위 에러 처리 + 재시도 제공

에러가 발생하면 `reset()` 함수를 호출해 클라이언트 컴포넌트를 다시 렌더링할 수 있고,
서버 컴포넌트를 다시 불러오고 싶다면 `router.refresh()`를 함께 사용해야 합니다.

### 서버 액션(Server Actions)

서버 액션은 클라이언트에서 직접 호출할 수 있는 **서버 함수 기반 API**입니다.  
한 줄의 함수로 데이터베이스 조회, 업데이트 등 서버 작업을 처리할 수 있으며,  
민감한 로직을 클라이언트에 노출하지 않아 보안상으로도 유리합니다.

✅ 클라이언트 → 서버 → DB 액션까지 한 함수로 끝냄

하지만, **서버에서만 예외를 처리하는 건 불충분**합니다.  
클라이언트 쪽에서도 오류 발생 시의 UI나 사용자 안내를 함께 설계해야 사용자 경험이 안정적입니다.

---

### 🔄 UI 동기화: revalidatePath()

서버 액션으로 데이터를 변경했다면, 변경 내용을 사용자에게 즉시 반영해야 하겠죠?  
이때는 Next.js에서 제공하는 `revalidatePath()`를 사용해 관련 경로를 **다시 캐싱하고 갱신**할 수 있습니다.

```
import { revalidatePath } from 'next/cache';

async function updateData() {
  await updateDatabase();
  revalidatePath('/some/path'); // 해당 경로 캐시 무효화 및 갱신
}
```

`revalidatePath()`는 지정된 경로의 전체 캐시를 비우고, 다음 요청 시 최신 데이터로 페이지를 재생성합니다.

#### ⚠️ 주의사항: 과도한 캐시 무효화 방지

revalidatePath를 사용하면 경로 단위로 관련 없는 캐시까지 모두 무효화될 수 있어 불필요한 재생성 비용이 발생할 수 있습니다.

#### 🏷 태그 기반 캐시 재검증: revalidateTag()

더 정밀한 제어가 필요할 땐, revalidateTag()를 사용하는 게 좋습니다.
데이터 단위로 캐시를 태깅해두고, 해당 태그만 선택적으로 무효화할 수 있습니다.

```
// 캐시 태그 지정
fetch('/api/data', {
  next: {
    tags: ['my-data-tag'],
  },
});

```

이 방식은 페이지 경로와 무관하게 데이터 단위로만 캐시를 제어할 수 있어
**On-Demand ISR**에서 특히 유용합니다.

### 🔀 Parallel Routes (병렬 라우트)

App Router에서는 여러 경로를 동시에 렌더링할 수 있는 병렬 라우팅 패턴도 지원합니다.
슬롯(@) 폴더를 사용하면 해당 경로를 실제 URL로 사용하지 않고,
`layout.tsx`에 `props` 형태로 자동 전달할 수 있습니다.

```
app/
├─ @sidebar/
│  └─ page.tsx
├─ @children/
│  └─ page.tsx
└─ layout.tsx

```

예를 들어, 대시보드 화면에서 왼쪽 사이드바와 본문 콘텐츠를
각각 다른 경로에서 병렬로 가져오는 식으로 활용할 수 있습니다.

> ❗ 병렬 라우트는 아직 실무에서 적용할 기회가 많진 않았지만, 대규모 화면 구성에 굉장히 유용한 기능이라고 생각합니다!

### 🧭 Intercepting Routes (인터셉팅 라우트)

인터셉팅 라우트는 클라이언트 내비게이션 중
특정 경로로 이동하려는 요청을 가로채 다른 UI로 대체할 수 있는 고급 기능입니다.
예: 모달, 오버레이 같은 UX에 사용합니다.

인터셉팅 라우트는 (.)와 같은 구문으로 인식됩니다.

구문별 의미

| 구문    | 설명                                |
| ------- | ----------------------------------- |
| `(.)`   | 같은 레벨 경로 가로채기             |
| `(..)`  | 한 단계 위 레벨의 레이아웃 가로채기 |
| `(...)` | 전체 app 루트에서 전역 가로채기     |

```
app/
├─ layout.tsx
├─ feed/
│   ├─ page.tsx
│   └─ (.)photo/
│       └─ [id]/page.tsx
└─ photo/
    └─ [id]/page.tsx
```

- 사용자는 /feed에서 /photo/1으로 이동했지만, 실제로는 feed 레이아웃 안에서 모달이 뜨는 형태

- 하지만 새로고침 시엔 /photo/1 전체 페이지가 정상 렌더링이 됩니다.

인스타그램에서 게시글을 클릭하면 모달 창이 열리며,  
**상단 URL이 `/p/게시물-id/?img_index=1` 형태로 변경되는 걸 볼 수 있습니다.**

![](https://velog.velcdn.com/images/qjatn0955/post/4d70bda3-d2e5-487c-af9a-e5658758a2dc/image.png)

이 상태에서 해당 링크를 **공유하거나 새로고침하면**,  
모달이 아닌 **전체 페이지 형태의 게시물 화면**이 렌더링됩니다.

![](https://velog.velcdn.com/images/qjatn0955/post/6c0f1c59-5146-48b3-adba-7c34cb25319c/image.png)

즉, **같은 URL인데도 페이지의 렌더링 방식이 달라지는** 거죠.  
클라이언트 내비게이션 중에는 모달 형태로 가로채고,  
직접 접근 시엔 전체 페이지로 렌더링됩니다.

#### 왜 새로고침하거나 링크로 직접 접속하면 전체 페이지가 렌더링될까요?

그 이유는, 이 경우 Next.js가 해당 URL에 직접 접근하기 때문입니다.
인터셉팅 라우트는 클라이언트 내비게이션 중에만 작동하며,
새로고침처럼 서버에서 처음부터 페이지를 불러오는 상황에서는
원래 정의된 해당 경로의 전체 페이지가 렌더링되게 됩니다.

이처럼 **Intercepting Routes**은 URL은 유지하면서도 **사용자 경험(UX)은 상황에 따라 다르게 제공**할 수 있는 기능입니다.

### 🖼️ 이미지 최적화 (Image Optimization)

Next.js는 `<Image />` 컴포넌트를 통해 기존 `<img />`보다 다양한 이미지 최적화 기능을 제공합니다.

> - 자동 포맷 변환: JPEG 이미지를 WebP, AVIF 등으로 자동 변환 <br/>
> - 반응형 크기 조절: 디바이스 해상도에 맞춰 최적 크기 제공 <br/>

- 지연 로딩(Lazy Loading): 화면에 보일 때만 이미지 로드

외부 이미지를 사용할 경우, 보안상의 이유로 next.config.js에 해당 이미지 호스트 도메인을 미리 등록해야 합니다.

```
// next.config.js(ts)
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
  },
};

```

예를 들어,
예를 들어, 홈 페이지에 .jpeg 형식 이미지를 삽입한 경우에도
Next.js의 `<Image />`를 사용하면 자동으로 WebP로 변환되고, `lazy loading`까지 적용됩니다.

![](https://velog.velcdn.com/images/qjatn0955/post/18215144-3a58-4f44-9c79-eb49fbf00a8c/image.gif)

### 검색엔진 최적화(SEO)

Next.js App Router에서는 generateMetadata() 함수를 통해
정적/동적 메타데이터를 타입 안전하게 생성할 수 있습니다.
이는 `<head>` 태그에 들어가는 title, description, og:image 등을 다루는 공식 API입니다.

```
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/product/${params.id}`);
  if (!response.ok) throw new Error(response.statusText);

  const product = await response.json();
  return {
    title: product.title,
    description: product.description,
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.coverImgUrl,
    },
  };
}


```

> 💡 주의: 위 코드에서는 페이지 본문과 메타데이터를 위해 같은 데이터를 fetch하고 있어
> “두 번 호출되는 거 아닌가?”라는 의문이 생길 수 있습니다.

하지만 Next.js는 **Request Memoization** 기능을 내장하고 있어,
동일한 요청은 한 번만 처리되고 내부적으로 재사용됩니다.
따라서 불필요한 중복 요청 없이 효율적으로 렌더링이 이루어집니다.

### ✅ Page Router vs App Router 요약 비교

| 항목                   | **Page Router**                                               | **App Router**                                                          |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **폴더 구조**          | `pages/` 기반, 파일 단위 라우팅                               | `app/` 기반, 폴더 단위 라우팅                                           |
| **레이아웃 구성**      | `getLayout` 함수로 수동 적용                                  | `layout.tsx` 파일로 중첩 및 자동 적용                                   |
| **데이터 페칭 / 캐시** | `getServerSideProps`, `getStaticProps`, `getStaticPaths` 사용 | `fetch()` + `cache` 옵션 + `next.revalidate` / `next.tags`              |
| **캐시 무효화**        | 별도 API Route 또는 클라이언트 로직으로 처리                  | `revalidatePath()` / `revalidateTag()` API 제공                         |
| **동적 라우팅**        | `[id]`, `[...id]`, `[[...id]]`                                | (`app/[id]/page.tsx`, `app/[...id]/page.tsx`, `app/[[...id]]/page.tsx`) |
| **병렬 라우트**        | ❌ 미지원                                                     | ✅ `@폴더` 구조로 병렬 렌더링 지원                                      |
| **인터셉팅 라우트**    | ❌ 미지원                                                     | ✅ `(.)`, `(..)`, `(…)` 구문으로 클라이언트 내비게이션 가로채기 지원    |
| **로딩·에러 처리**     | ❌ 페이지 전체 수준에서만 가능                                | ✅ `loading.tsx`, `error.tsx`로 컴포넌트 단위 스트리밍+에러 처리 지원   |
| **서버 액션**          | ❌ API Route 등 별도 구현 필요                                | ✅ Server Actions으로 단일 함수에서 데이터베이스 조회·업데이트 가능     |
| **RSC 지원**           | ❌ 미지원                                                     | ✅ React Server Components 기본 지원                                    |

<br/>
<br/>
<br/>

## 📚 Next.js를 다시 바라보다

이번 글을 통해 Page Router와 App Router의 구조, 데이터 처리 방식, 레이아웃 관리, 그리고 고급 기능들(RSC, Intercepting Routes 등)까지 정리해봤습니다.

예전에 진행했던 **체쿠리**라는 프로젝트에서는 Next.js로 처음 시작했다가,  
구조적으로 잘 만들지 못한 아쉬움 때문에 결국 React로 마이그레이션했던 경험이 있습니다.  
당시엔 React로 바꾸면 더 나은 방향이 있을 거라 생각해서 다양한 시도를 해봤죠.  
👉 [[체쿠리] Next.js에서 React로의 여정](https://velog.io/@qjatn0955/%EC%B2%B4%EC%BF%A0%EB%A6%AC-Next.js%EC%97%90%EC%84%9C-React.js%EB%A1%9C%EC%9D%98-%EC%97%AC%EC%A0%95)

지금 돌아보면 아쉬움도 많이 남습니다.  
그래서 이번엔 **App Router** 기반으로 다시 한 번 제대로 구조를 잡아보려고 합니다.

이번 글은 Next.js를 공부하면서, 제가 중요하다고 느꼈던 부분들을 정리해본 기록입니다.  
모든 내용이 다 중요하지만, 특히 기억해두고 싶은 개념들을 중심으로 간추려 정리해봤습니다.

혹시 빠뜨린 개념이나 깊이 있게 다루지 못한 부분이 있다면 양해 부탁드립니다. 🙇🏻‍♂️

최대한 정리해서 썼지만, 읽는 분에 따라 부족하게 느껴지는 부분이 있을 수도 있습니다.
그래도 강의를 듣고 프로젝트에 직접 적용해본 경험을 바탕으로 솔직하게 담아보려 했습니다!

덕분에 단순히 문법을 익히는 수준을 넘어,  
**왜 이렇게 설계되었는지**, **실무에선 어떤 선택을 해야 하는지**  
스스로 질문하고 고민해볼 수 있는 좋은 시간이었습니다.

끝까지 읽어주셔서 감사합니다. 🙇🏻‍♂️

> 강의: [한 입 크기로 잘라먹는 Next.js(v15) ](https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard)
