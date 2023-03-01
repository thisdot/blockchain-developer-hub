import LearnHero from '@/sections/LearnHero';
import data from '@/data/learn.yaml';
import LearnCrypto from '@/sections/LearnCrypto';
import styles from '@/styles/pages/LearnPage.module.css';
import PagePagination from '@/components/PagePagination';
import { useDataContext } from '@/context/DataProvider';
import { useEffect } from 'react';

function Learn() {
  const { resources } = data;
  const { userId, setNewCourses, setNewTutorials } = useDataContext();

  const getCourses = async () => {
    const resp = await fetch('/api/courses');
    if (resp.status === 200) {
      const { data } = await resp.json();
      setNewCourses([...data]);
    }
  };
  const getTutorials = async () => {
    const resp = await fetch('/api/tutorials');
    if (resp.status === 200) {
      const { data } = await resp.json();
      setNewTutorials([...data]);
    }
  };

  useEffect(() => {
    async function getData() {
      await getCourses();
      await getTutorials();
    }
    if (userId) {
      getData();
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <LearnHero />
      <section className={styles.contents}>
        {resources.map(({ id, name, logo, courses, tutorials }) => (
          <LearnCrypto
            key={id}
            id={id}
            name={name}
            logo={logo}
            logoAlt={`${name} Logo`}
            courses={courses}
            tutorials={tutorials}
          />
        ))}
      </section>
      <PagePagination text="Ecosystem" link="/ecosystem-map" />
    </div>
  );
}

export default Learn;
