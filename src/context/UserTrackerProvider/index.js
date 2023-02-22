import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserTrackerContext = createContext({});
export const UserTrackerProvider = ({ children }) => {
  const [courseRead, setCourseRead] = useState([]);
  const [tutorialRead, setTutorialRead] = useState([]);

  return <UserTrackerContext.Provider value={{ courseRead, tutorialRead }}>{children}</UserTrackerContext.Provider>;
};

UserTrackerProvider.propTypes = {
  children: PropTypes.node,
};

export const useUserTrackerContext = () => useContext(UserTrackerContext);
