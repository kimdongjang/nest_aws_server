import { NextPage } from "next";
import { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import Layout from "../components/Layout";
import { wrapper } from "../modules/store";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  </>
};

export default wrapper.withRedux(MyApp);
