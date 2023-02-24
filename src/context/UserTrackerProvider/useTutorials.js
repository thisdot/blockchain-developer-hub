import { useState } from 'react';

export default function useTutorials(userId) {
  const [tutorialsRead, setTutorialsRead] = useState([]);
  const [favTutorials, setFavTutorials] = useState([]);

  const getTutorials = async () => {
    const resp = await fetch('/api/user/tutorials', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        target: 'all',
      }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setTutorialsRead(read);
      setFavTutorials(favourites);
    }
  };

  const updateFavTutorials = async ({ title, action }) => {
    if (action === 0) {
      setFavTutorials((prev) => prev.filter((res) => res.title !== title));
    } else {
      setFavTutorials([
        ...favTutorials,
        {
          title,
        },
      ]);
    }
    const resp = await fetch('/api/user/tutorials/favourite', {
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
        setFavTutorials([
          ...favTutorials,
          {
            title,
          },
        ]);
      } else {
        setFavTutorials((prev) => prev.filter((res) => res.title !== title));
      }
    }
  };

  const updateReadTutorials = async ({ title }) => {
    const resp = await fetch('/api/user/tutorials/read', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
      }),
    });

    if (resp.status === 200) {
      setTutorialsRead([
        ...tutorialsRead,
        {
          title,
        },
      ]);
    }
  };

  return [tutorialsRead, favTutorials, getTutorials, updateFavTutorials, updateReadTutorials];
}
