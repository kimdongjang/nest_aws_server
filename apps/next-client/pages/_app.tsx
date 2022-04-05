import { NextPage } from "next";
import { AppProps } from "next/app";
import React from "react";
import { wrapper } from "../modules/store";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default wrapper.withRedux(MyApp);
