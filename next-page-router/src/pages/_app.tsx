import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  // getLayout은 페이지를 인자로 받아서 레이아웃을 반환하는 함수이다.
  // getLayout은 페이지가 없을 수도 있기 때문에 ?를 붙인다.
  getLayout?: (page: ReactNode) => ReactNode;
};
export default function App({
  Component,
  pageProps,
}: AppProps & {
  // NextPageWithLayout은 NextPage 타입을 확장한 것이다.
  Component: NextPageWithLayout;
}) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
