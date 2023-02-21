import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import PropTypes from 'prop-types';
import DefaultLayout from '@/layouts/DefaultLayout';
import useGoogleTagManager from '@/hooks/useGoogleTagManager';
import SolanaWalletProvider from 'src/context/SolanaWalletProvider';
import { DataProvider } from 'src/context/DataProvider';

function MyApp({ Component, pageProps }) {
  useGoogleTagManager(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING);

  return (
    <SolanaWalletProvider>
      <DataProvider>
        <DefaultLayout>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </DefaultLayout>
      </DataProvider>
    </SolanaWalletProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
