import { useState } from 'react';

export default function useCaseStudies(userId) {
  const [case_studiesRead, setCaseStudiesRead] = useState([]);
  const [favCaseStudies, setFavCaseStudies] = useState([]);

  const getCaseStudies = async () => {
    const resp = await fetch('/api/user/case-studies', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        target: 'all',
      }),
    });
    if (resp.status === 200) {
      const { data } = await resp.json();
      const { read, favourites } = data;
      setCaseStudiesRead(read);
      setFavCaseStudies(favourites);
    }
  };

  const updateFavCaseStudies = async ({ title, action }) => {
    if (action === 0) {
      setFavCaseStudies((prev) => prev.filter((res) => res.title !== title));
    } else {
      setFavCaseStudies([
        ...favCaseStudies,
        {
          title,
        },
      ]);
    }

    const resp = await fetch('/api/user/case-studies/favourite', {
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
        setFavCaseStudies([
          ...favCaseStudies,
          {
            title,
          },
        ]);
      } else {
        setFavCaseStudies((prev) => prev.filter((res) => res.title !== title));
      }
    }
  };

  const updateReadCaseStudies = async ({ title }) => {
    const resp = await fetch('/api/user/case-studies/read', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        title,
      }),
    });

    if (resp.status === 200) {
      setCaseStudiesRead([
        ...case_studiesRead,
        {
          title,
        },
      ]);
    }
  };

  return [case_studiesRead, favCaseStudies, getCaseStudies, updateFavCaseStudies, updateReadCaseStudies];
}
