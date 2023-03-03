import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import PropTypes from 'prop-types';

const ETHWalletProvider = ({ children }) => {
  const PROJECT_ID = process.env.NEXT_WALLET_PROJECT_ID;
  /**
   * https://explorer.walletconnect.com/?type=wallet
   * here you can get ID's of wallet that you wanna show on the modal
   */
  const explorerAllowList = [
    //MetaMask ID
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  ];

  const chains = [mainnet];

  // Wagmi client
  const { provider } = configureChains(chains, [walletConnectProvider({ projectId: PROJECT_ID })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: PROJECT_ID,
      version: '1',
      appName: 'bchainlinkers',
      chains,
    }),
    provider,
  });

  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>

      <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} explorerAllowList={explorerAllowList} />
    </>
  );
};

ETHWalletProvider.propTypes = {
  children: PropTypes.node,
};

export default ETHWalletProvider;
