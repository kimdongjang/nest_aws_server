import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components';
import { wrapper } from 'store';

// import '../styles/globals.css'
import GlobalStyle from 'styles/global-styles';
import { theme } from 'styles/theme';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default wrapper.withRedux(MyApp)