import { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDataContext } from '../DataProvider';
import useCourses from './useCourses';
import useTutorials from './useTutorials';
import useWorkshops from './useWorkshops';
import useCaseStudies from './useCaseStudies';

const UserTrackerContext = createContext({
  coursesRead: [],
  favCourses: [],
  tutorialsRead: [],
  favTutorials: [],
  hackathonsRead: [],
  favHackathons: [],
  workshopsRead: [],
  favWorkshops: [],
  caseStudiesRead: [],
  favCaseStudies: [],
  updateFavCourses: () => {},
  updateReadCourses: () => {},
  updateFavTutorials: () => {},
  updateReadTutorials: () => {},
  updateFavWorkshops: () => {},
  updateReadWorkshops: () => {},
  updateFavCaseStudies: () => {},
  updateReadCaseStudies: () => {},
});

export const UserTrackerProvider = ({ children }) => {
  const { userId } = useDataContext();
  const [coursesRead, favCourses, getCourses, updateFavCourses, updateReadCourses] = useCourses(userId);
  const [tutorialsRead, favTutorials, getTutorials, updateFavTutorials, updateReadTutorials] = useTutorials(userId);
  const [workshopsRead, favWorkshops, getWorkshops, updateFavWorkshops, updateReadWorkshops] = useWorkshops(userId);
  const [caseStudiesRead, favCaseStudies, getCaseStudies, updateFavCaseStudies, updateReadCaseStudies] =
    useCaseStudies(userId);

  useEffect(() => {
    if (userId) {
      getCourses();
      getTutorials();
      getWorkshops();
      getCaseStudies();
    }
  }, [userId]);

  return (
    <UserTrackerContext.Provider
      value={{
        coursesRead,
        favCourses,
        tutorialsRead,
        favTutorials,
        workshopsRead,
        favWorkshops,
        caseStudiesRead,
        favCaseStudies,
        updateFavCourses,
        updateReadCourses,
        updateFavTutorials,
        updateReadTutorials,
        updateFavWorkshops,
        updateReadWorkshops,
        updateFavCaseStudies,
        updateReadCaseStudies,
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
