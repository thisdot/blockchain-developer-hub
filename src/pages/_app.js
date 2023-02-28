import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import PropTypes from 'prop-types';
import DefaultLayout from '@/layouts/DefaultLayout';
import useGoogleTagManager from '@/hooks/useGoogleTagManager';
import SolanaWalletProvider from '@/context/SolanaWalletProvider';
import { DataProvider } from '@/context/DataProvider';
import { UserTrackerProvider } from '@/context/UserTrackerProvider';
import getInternalCaseStudies from '@/helpers/getInternalCaseStudies';

function MyApp({ Component, pageProps }) {
  useGoogleTagManager(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING);

  return (
    <SolanaWalletProvider>
      <DataProvider data={pageProps.internal_case_studies}>
        <UserTrackerProvider>
          <DefaultLayout>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
          </DefaultLayout>
        </UserTrackerProvider>
      </DataProvider>
    </SolanaWalletProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;

export const getStaticProps = async () => {
  const internal_case_studies = await getInternalCaseStudies();
  return {
    props: {
      internal_case_studies,
    },
  };
};
