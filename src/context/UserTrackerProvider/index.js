import { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDataContext } from '../DataProvider';
import useCourses from './useCourses';
import useTutorials from './useTutorials';
import useHackathons from './useHackathons';

const UserTrackerContext = createContext({
  coursesRead: [],
  favCourses: [],
  tutorialsRead: [],
  favTutorials: [],
  hackathonsRead: [],
  favHackathons: [],
  updateFavCourses: () => {},
  updateReadCourses: () => {},
  updateFavTutorials: () => {},
  updateReadTutorials: () => {},
  updateFavHackathons: () => {},
  updateReadHackathons: () => {},
});

export const UserTrackerProvider = ({ children }) => {
  const { userId } = useDataContext();
  const [coursesRead, favCourses, getCourses, updateFavCourses, updateReadCourses] = useCourses(userId);
  const [tutorialsRead, favTutorials, getTutorials, updateFavTutorials, updateReadTutorials] = useTutorials(userId);

  const [hackathonsRead, favHackathons, getHackathons, updateFavHackathons, updateReadHackathons] =
    useHackathons(userId);

  useEffect(() => {
    if (userId) {
      getCourses();
      getTutorials();
      getHackathons();
    }
  }, [userId]);

  return (
    <UserTrackerContext.Provider
      value={{
        coursesRead,
        favCourses,
        tutorialsRead,
        favTutorials,
        hackathonsRead,
        favHackathons,
        updateFavCourses,
        updateReadCourses,
        updateFavTutorials,
        updateReadTutorials,
        updateFavHackathons,
        updateReadHackathons,
      }}
    >
      {children}
    </UserTrackerContext.Provider>
  );
};

UserTrackerProvider.propTypes = {
  children: PropTypes.node,
};

export const useUserTrackerContext = () => useContext(UserTrackerContext);
