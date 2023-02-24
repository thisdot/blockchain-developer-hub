import { useState } from 'react';

export default function useHackathons(userId) {
  const [hackathonsRead, setHackathonsRead] = useState([]);
  const [favHackathons, setFavHackathons] = useState([]);

  const getHackathons = async () => {
    const resp = await fetch('/api/user/hackathons', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        target: 'all',
      }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setHackathonsRead(read);
      setFavHackathons(favourites);
    }
  };

  const updateFavHackathons = async ({ title, action }) => {
    if (action === 0) {
      setFavHackathons((prev) => prev.filter((res) => res.title !== title));
    } else {
      setFavHackathons([
        ...favHackathons,
        {
          title,
        },
      ]);
    }
    const resp = await fetch('/api/user/hackathons/favourite', {
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
        setFavHackathons([
          ...favHackathons,
          {
            title,
          },
        ]);
      } else {
        setFavHackathons((prev) => prev.filter((res) => res.title !== title));
      }
    }
  };

  const updateReadHackathons = async ({ title }) => {
    const resp = await fetch('/api/user/hackathons/read', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
      }),
    });

    if (resp.status === 200) {
      setHackathonsRead([
        ...hackathonsRead,
        {
          title,
        },
      ]);
    }
  };

  return [hackathonsRead, favHackathons, getHackathons, updateFavHackathons, updateReadHackathons];
}
