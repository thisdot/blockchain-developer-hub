import PagePagination from '@/components/PagePagination';
import { useDataContext } from '@/context/DataProvider';
import data from '@/data/build.yaml';
import removePastEvent from '@/helpers/removePastEvent';
import BuildPageSection from '@/sections/BuildPageSection';
import styles from '@/styles/pages/BuildPage.module.css';
import { useEffect } from 'react';
function Build() {
  const { categories } = data;

  const { userId, setNewWorkshops } = useDataContext();

  const getWorkshops = async () => {
    const resp = await fetch('/api/workshops');
    if (resp.status === 200) {
      const { data } = await resp.json();
      setNewWorkshops([...data]);
    }
  };

  useEffect(() => {
    async function getData() {
      await getWorkshops();
    }
    if (userId) {
      getData();
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      {categories.map(({ name, overview, items, href }, index) => (
        <BuildPageSection key={index} name={name} overview={overview} href={href} items={removePastEvent(items)} />
      ))}
      <PagePagination hasPadding={false} text="Ship" link="/ship" />
    </div>
  );
}

export default Build;
