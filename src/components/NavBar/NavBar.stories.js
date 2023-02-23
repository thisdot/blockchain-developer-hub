import SolanaWalletProvider from '@/context/SolanaWalletProvider';
import NavBar from './NavBar';
import { DataProvider } from '@/context/DataProvider';

export default {
  title: 'component/Nav Bar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => (
  <SolanaWalletProvider>
    <DataProvider>
      <NavBar {...args} />
    </DataProvider>
  </SolanaWalletProvider>
);

export const Default = Template.bind({});
