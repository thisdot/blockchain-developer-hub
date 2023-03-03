import WalletModalBtn from '../WalletModalBtn';
import styles from './WalletBtn.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDataContext } from '@/context/DataProvider';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import WalletAvatar from '@/icons/wallet-avatar.svg';

const WalletBtn = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { authenticating, userId, setUserId } = useDataContext();
  const { open } = useWeb3Modal();
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  const dropdownListClasses = clsx(
    'wallet-adapter-dropdown-list',
    {
      'wallet-adapter-dropdown-list-active': active,
    },
    styles.dropdown_list
  );

  const content = useMemo(() => {
    if (!isConnected || !address) return null;
    return address.slice(0, 4) + '..' + address.slice(-4);
  }, [isConnected, address]);

  const changeWallet = async () => {
    disconnect();
    setActive(false);
    await open({ route: 'ConnectWallet' });
  };

  const openDropdown = useCallback(() => {
    setActive(!active);
  }, [active]);

  const closeDropdown = useCallback(() => {
    setActive(false);
  }, []);

  const isWalletInstalled = useCallback(() => {
    return isConnected && address;
  }, [address, isConnected]);

  const logOut = () => {
    disconnect();
    setUserId(null);
    closeDropdown();
    sessionStorage.removeItem('last_log');
  };

  useEffect(() => {
    const listener = (event) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or it's descendants
      if (!node || node.contains(event.target)) return;

      closeDropdown();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, closeDropdown]);

  if (!isWalletInstalled() || (!userId && !authenticating)) {
    return (
      <div className={clsx(styles.dropdown_wrapper)}>
        <WalletModalBtn className={clsx('btn-sm--extra-bold', styles.btn_connect)} />
      </div>
    );
  }

  return (
    <div className={styles.dropdown_wrapper}>
      <button className={clsx('btn-sm--extra-bold', styles.wallet_btn_dropdown)} disabled={authenticating}>
        {isConnecting ? (
          <small style={{ flex: 1 }}>Connecting...</small>
        ) : isWalletInstalled() ? (
          <>
            {content && <small>{content}</small>}
            <div onClick={openDropdown} className={styles.dropdown_icons}>
              <WalletAvatar />
              <img src={'/icons/dropdown.svg'} alt={'dropdown image'} />
            </div>
          </>
        ) : null}
      </button>
      <ul aria-label="dropdown-list" className={dropdownListClasses} ref={ref} role="menu">
        <li onClick={changeWallet} className="wallet-adapter-dropdown-list-item" role="menuitem">
          Change wallet
        </li>
        <li onClick={logOut} className="wallet-adapter-dropdown-list-item" role="menuitem">
          Disconnect
        </li>
      </ul>
    </div>
  );
};

export default WalletBtn;
