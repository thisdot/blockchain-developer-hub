import { useState } from 'react';

export default function useWorkshops(userId) {
  const [workshopsRead, setWorkshopsRead] = useState([]);
  const [favWorkshops, setFavWorkshops] = useState([]);

  const getWorkshops = async () => {
    const resp = await fetch('/api/user/workshops', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        target: 'all',
      }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setWorkshopsRead(read);
      setFavWorkshops(favourites);
    }
  };

  const updateFavWorkshops = async ({ title, action }) => {
    if (action === 0) {
      setFavWorkshops((prev) => prev.filter((res) => res.title !== title));
    } else {
      setFavWorkshops([
        ...favWorkshops,
        {
          title,
        },
      ]);
    }

    const resp = await fetch('/api/user/workshops/favourite', {
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
        setFavWorkshops([
          ...favWorkshops,
          {
            title,
          },
        ]);
      } else {
        setFavWorkshops((prev) => prev.filter((res) => res.title !== title));
      }
    }
  };

  const updateReadWorkshops = async ({ title }) => {
    const resp = await fetch('/api/user/workshops/read', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
      }),
    });

    if (resp.status === 200) {
      setWorkshopsRead([
        ...workshopsRead,
        {
          title,
        },
      ]);
    }
  };

  return [workshopsRead, favWorkshops, getWorkshops, updateFavWorkshops, updateReadWorkshops];
}
