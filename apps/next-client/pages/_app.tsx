import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components';
import { storeWrapper } from '../store';

// import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  )
}

export default storeWrapper.withRedux(MyApp)