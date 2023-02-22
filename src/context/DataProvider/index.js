import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useWallet } from '@solana/wallet-adapter-react';

const DataContext = createContext({
  userId: null,
  authenticating: false,
  lastLogin: null,
});
export const DataProvider = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [userId, setUserId] = useState(null);
  const [lastLogIn, setLastLogIn] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);
  const successStatuses = [200, 201];

  const getUserId = async () => {
    setAuthenticating(true);
    const resp = await fetch('/api/user/auth', {
      method: 'POST',
      body: JSON.stringify({ id: publicKey.toBase58() }),
    });

    const status = resp.status;

    if (successStatuses.includes(status)) {
      const res = await resp.json();
      setUserId(res.userId);
      setLastLogIn(res.lastLogin);
    }
    setAuthenticating(false);
  };

  useEffect(() => {
    if (connected && publicKey) {
      getUserId();
    }
  }, [connected, publicKey]);

  return <DataContext.Provider value={{ userId, authenticating, lastLogIn }}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node,
};

export const useDataContext = () => useContext(DataContext);
