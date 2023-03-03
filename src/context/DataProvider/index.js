import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useLearnContents from './useLearnContents';
import { useAccount } from 'wagmi';

const DataContext = createContext({
  userId: null,
  authenticating: false,
  lastLogIn: null,
  newCourses: [],
  newTutorials: [],
  newWorkshops: [],
  newCaseStudies: [],
  setUserId: () => {},
  setNewWorkshops: () => {},
  setNewCaseStudies: () => {},
  setNewCourses: () => {},
  setNewTutorials: () => {},
});
export const DataProvider = (props) => {
  const { address, isConnected } = useAccount();
  const [userId, setUserId] = useState(null);
  const [lastLogIn, setLastLogIn] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);
  const successStatuses = [200, 201];
  const [
    newCourses,
    newTutorials,
    newWorkshops,
    newCaseStudies,
    setNewWorkshops,
    setNewCaseStudies,
    setNewCourses,
    setNewTutorials,
  ] = useLearnContents(props.data);

  const getUserId = async () => {
    setAuthenticating(true);
    const last_log = sessionStorage.getItem('last_log');
    const resp = await fetch('/api/user/auth', {
      method: 'POST',
      body: JSON.stringify({ id: address }),
    });

    const status = resp.status;

    if (successStatuses.includes(status)) {
      const res = await resp.json();
      setUserId(res.userId);
      if (!last_log) {
        sessionStorage.setItem('last_log', res.lastLogIn);
        setLastLogIn(res.lastLogIn);
      } else {
        setLastLogIn(last_log);
      }
    }
    setAuthenticating(false);
  };

  useEffect(() => {
    if (isConnected && address) {
      getUserId();
    } else {
      setUserId(null);
    }
  }, [isConnected, address]);

  return (
    <DataContext.Provider
      value={{
        userId,
        authenticating,
        lastLogIn,
        newCourses,
        newTutorials,
        newWorkshops,
        newCaseStudies,
        setUserId,
        setNewWorkshops,
        setNewCaseStudies,
        setNewCourses,
        setNewTutorials,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};

export const useDataContext = () => useContext(DataContext);
