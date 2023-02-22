import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDataContext } from '../DataProvider';

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
  const [coursesRead, setCoursesRead] = useState([]);
  const [favCourses, setFavCourses] = useState([]);
  const [tutorialsRead, setTutorialsRead] = useState([]);
  const [favTutorials, setFavTutorials] = useState([]);
  const [hackathonsRead, setHackathonsRead] = useState([]);
  const [favHackathons, setFavHackathons] = useState([]);

  const getCourses = async () => {
    const resp = await fetch('/api/user/courses', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, target: 'all' }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setCoursesRead(read);
      setFavCourses(favourites);
    }
  };

  const updateFavCourses = async ({ title, action }) => {
    const resp = await fetch('/api/user/courses/favourite', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title, action }),
    });

    if (resp.status === 200) {
      if (action === 0) {
        setFavCourses((prev) => prev.filter((res) => res.title !== title));
      } else {
        setFavCourses([...favCourses, { title }]);
      }
    }
  };

  const updateReadCourses = async ({ title }) => {
    const resp = await fetch('/api/user/courses/read', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title }),
    });

    if (resp.status === 200) {
      setCoursesRead([...coursesRead, { title }]);
    }
  };

  const getTutorials = async () => {
    const resp = await fetch('/api/user/tutorials', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, target: 'all' }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setTutorialsRead(read);
      setFavTutorials(favourites);
    }
  };

  const updateFavTutorials = async ({ title, action }) => {
    const resp = await fetch('/api/user/tutorials/favourite', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title, action }),
    });

    if (resp.status === 200) {
      if (action === 0) {
        setFavTutorials((prev) => prev.filter((res) => res.title !== title));
      } else {
        setFavTutorials([...favCourses, { title }]);
      }
    }
  };

  const updateReadTutorials = async ({ title }) => {
    const resp = await fetch('/api/user/tutorials/read', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title }),
    });

    if (resp.status === 200) {
      setTutorialsRead([...tutorialsRead, { title }]);
    }
  };

  const getHackathons = async () => {
    const resp = await fetch('/api/user/tutorials', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, target: 'all' }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setHackathonsRead(read);
      setFavHackathons(favourites);
    }
  };

  const updateFavHackathons = async ({ title, action }) => {
    const resp = await fetch('/api/user/hackathons/favourite', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title, action }),
    });

    if (resp.status === 200) {
      if (action === 0) {
        setFavHackathons((prev) => prev.filter((res) => res.title !== title));
      } else {
        setFavHackathons([...favCourses, { title }]);
      }
    }
  };

  const updateReadHackathons = async ({ title }) => {
    const resp = await fetch('/api/user/hackathons/read', {
      method: 'POST',
      body: JSON.stringify({ userid: userId, title }),
    });

    if (resp.status === 200) {
      setHackathonsRead([...hackathonsRead, { title }]);
    }
  };

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
