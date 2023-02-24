import { useState } from 'react';

export default function useCourses(userId) {
  const [coursesRead, setCoursesRead] = useState([]);
  const [favCourses, setFavCourses] = useState([]);

  const getCourses = async () => {
    const resp = await fetch('/api/user/courses', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        target: 'all',
      }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setCoursesRead(read);
      setFavCourses(favourites);
    }
  };

  const updateFavCourses = async ({ title, action }) => {
    if (action === 0) {
      setFavCourses((prev) => prev.filter((res) => res.title !== title));
    } else {
      setFavCourses([
        ...favCourses,
        {
          title,
        },
      ]);
    }

    const resp = await fetch('/api/user/courses/favourite', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
        action,
      }),
    });

    if (resp.status !== 200) {
      //Reverse action
      if (action === 0) {
        setFavCourses([
          ...favCourses,
          {
            title,
          },
        ]);
      } else {
        setFavCourses((prev) => prev.filter((res) => res.title !== title));
      }
    }
  };

  const updateReadCourses = async ({ title }) => {
    const resp = await fetch('/api/user/courses/read', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
      }),
    });

    if (resp.status === 200) {
      setCoursesRead([
        ...coursesRead,
        {
          title,
        },
      ]);
    }
  };

  return [coursesRead, favCourses, getCourses, updateFavCourses, updateReadCourses];
}
