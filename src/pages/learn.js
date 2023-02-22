import LearnHero from '@/sections/LearnHero';
import data from '@/data/learn.yaml';
import LearnCrypto from '@/sections/LearnCrypto';
import styles from '@/styles/pages/LearnPage.module.css';
import PagePagination from '@/components/PagePagination';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

function Learn() {
  const { resources } = data;
  const { connected, publicKey } = useWallet();

  const getReadCourses = async () => {
    const coursesResp = await fetch('/api/user/courses', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    console.log('====================================');
    console.log(coursesResp);
    console.log('====================================');
  };
  const getReadTutorials = async () => {
    const tutorialsResp = await fetch('/api/user/tutorials', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    console.log('====================================');
    console.log(tutorialsResp);
    console.log('====================================');
  };

  useEffect(() => {
    if (connected && publicKey) {
      getReadCourses();
      getReadTutorials();
    }
  }, [connected, publicKey]);
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
