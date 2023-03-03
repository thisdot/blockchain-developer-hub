import styles from './HomePageConnectWallet.module.css';
import clsx from 'clsx';
import WalletModalBtn from '@/components/WalletModalBtn';
import { useDataContext } from '@/context/DataProvider';
import { useAccount } from 'wagmi';

const HomePageConnectWallet = () => {
  const { authenticating } = useDataContext();
  const { address, isConnected } = useAccount();

  if (address && isConnected) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h4 className={clsx('h-100', styles.content_heading)}>Customize your experience </h4>
        <div className={clsx('text-lg--long', styles.content_description)}>
          Sign up to improve interaction with the platform and get an exclusive access to new releases.
        </div>
      </div>
      <WalletModalBtn className={clsx('btn--extra-bold', styles.connect_wallet_btn)}>
        {authenticating ? 'connecting...' : 'Connect Wallet'}
      </WalletModalBtn>
    </div>
  );
};

export default HomePageConnectWallet;
