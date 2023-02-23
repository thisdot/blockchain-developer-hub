import { DataProvider } from '@/context/DataProvider';
import SolanaWalletProvider from '@/context/SolanaWalletProvider';
import HomePageConnectWallet from './HomePageConnectWallet';

export default {
  title: 'section/ HomePageConnectWallet',
  component: HomePageConnectWallet,
};

const Template = () => (
  <SolanaWalletProvider>
    <DataProvider>
      <HomePageConnectWallet />
    </DataProvider>
  </SolanaWalletProvider>
);

export const Default = Template.bind({});
