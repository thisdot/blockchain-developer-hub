import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import WalletModalBtn from '../WalletModalBtn';
import WalletConnectBtn from '../WalletConnectBtn';
import styles from './WalletBtn.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDataContext } from '@/context/DataProvider';

const WalletBtn = () => {
  const { publicKey, wallet, disconnect } = useWallet();
  const { authenticating } = useDataContext();
  const { setVisible } = useWalletModal();
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  const dropdownListClasses = clsx(
    'wallet-adapter-dropdown-list',
    {
      'wallet-adapter-dropdown-list-active': active,
    },
    styles.dropdown_list
  );

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + '..' + base58.slice(-4);
  }, [wallet, base58]);

  const changeWallet = () => {
    setVisible(true);
    setActive(false);
  };

  const openDropdown = useCallback(() => {
    setActive(!active);
  }, [active]);

  const closeDropdown = useCallback(() => {
    setActive(false);
  }, []);

  const isWalletInstalled = useCallback(() => {
    return wallet && wallet.readyState === 'Installed';
  }, [wallet]);

  useEffect(() => {
    const listener = (event) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or its descendants
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

  if (!wallet) {
    return (
      <div className={clsx(styles.dropdown_wrapper)}>
        <WalletModalBtn className={clsx('btn-sm--extra-bold', styles.btn_connect)} />
      </div>
    );
  }

  if (!base58 && isWalletInstalled()) {
    return (
      <div className={clsx(styles.dropdown_wrapper)}>
        <WalletConnectBtn className={clsx('btn-sm--extra-bold', styles.btn_connect)} />
      </div>
    );
  }

  return (
    <div className={clsx('wallet-adapter-dropdown', styles.dropdown_wrapper)}>
      <button
        title={wallet ? wallet.adapter.name : 'disconnected'}
        className={clsx('btn-sm--extra-bold', styles.wallet_btn_dropdown)}
        disabled={authenticating}
      >
        {authenticating ? (
          <small style={{ flex: 1 }}>Connecting...</small>
        ) : isWalletInstalled() ? (
          <>
            {content && <small>{content}</small>}
            <div onClick={openDropdown} className={styles.dropdown_icons}>
              <img src={wallet.adapter.icon} alt={wallet.adapter.name + 'image'} className={styles.avatar} />
              <img src={'/icons/dropdown.svg'} alt={'dropdown image'} />
            </div>
          </>
        ) : null}
      </button>
      <ul aria-label="dropdown-list" className={dropdownListClasses} ref={ref} role="menu">
        <li onClick={changeWallet} className="wallet-adapter-dropdown-list-item" role="menuitem">
          Change wallet
        </li>
        <li
          onClick={() => [disconnect(), closeDropdown()]}
          className="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Disconnect
        </li>
      </ul>
    </div>
  );
};

export default WalletBtn;
