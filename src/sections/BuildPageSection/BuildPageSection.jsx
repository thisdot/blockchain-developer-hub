import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './BuildPageSection.module.css';
import Card from '@/components/Card';
import ShareModal from '@/components/ShareModal';
import { useCallback, useState } from 'react';
import NoItemPlaceholder from '@/components/NoItemPlaceholder';
import HeadingHash from '@/components/HeadingHash';
import { useUserTrackerContext } from '@/context/UserTrackerProvider';
import { user_activities } from '../../../server/activities';
import useCheckWorkshop from './useCheckWorkshop';
import useCheckCaseStudy from './useCheckCaseStudy';

function BuildPageSection({ name, overview, items, href }) {
  const [checkReadWorkshop, checkFavWorkshop] = useCheckWorkshop();
  const [checkReadCaseStudy, checkFavCaseStudy] = useCheckCaseStudy();
  const {
    workshopsRead,
    caseStudiesRead,
    favWorkshops,
    favCaseStudies,
    updateReadWorkshops,
    updateFavWorkshops,
    updateReadCaseStudies,
    updateFavCaseStudies,
  } = useUserTrackerContext();
  const headingClasses = clsx('subtitle-bold', styles.headings);
  const overviewClasses = clsx('text-md--long', styles.overview);
  const id = name.replace(/[" "]/g, '').toLowerCase();
  const [shareItem, setShareItem] = useState(null);

  const checkRead = useCallback(
    (title) => {
      if (user_activities.case_studies === name.toLowerCase()) {
        return checkReadCaseStudy(title);
      } else if (user_activities.workshops === name.toLowerCase()) {
        return checkReadWorkshop(title);
      }
    },
    [workshopsRead, caseStudiesRead]
  );
  const checkFavourite = useCallback(
    (title) => {
      if (user_activities.case_studies === name.toLowerCase()) {
        return checkFavCaseStudy(title);
      } else if (user_activities.workshops === name.toLowerCase()) {
        return checkFavWorkshop(title);
      }
    },
    [favWorkshops, favCaseStudies]
  );

  const updateRead = (data) => {
    if (user_activities.case_studies === name.toLowerCase()) {
      updateReadCaseStudies(data);
    } else if (user_activities.workshops === name.toLowerCase()) {
      updateReadWorkshops(data);
    }
  };
  const updateFavourite = (data) => {
    if (user_activities.case_studies === name.toLowerCase()) {
      updateFavCaseStudies(data);
    } else if (user_activities.workshops === name.toLowerCase()) {
      updateFavWorkshops(data);
    }
  };

  const isAllowActivity = useCallback(() => {
    const alllowActivity = [user_activities.case_studies, user_activities.workshops];
    return alllowActivity.includes(name.toLowerCase());
  }, [name]);

  return (
    <div className={styles.mainContent} id={id}>
      <h1 className={headingClasses}>
        <HeadingHash to={href} />
        <a href={href}>{name}</a>
      </h1>
      {overview && <p className={overviewClasses}>{overview}</p>}
      {items.length ? (
        <div className={styles.cards}>
          {items.map(
            ({ title, prize, image, description, location, online, on_demand, start_date, end_date, href }, index) => (
              <Card
                title={title}
                prize={prize}
                description={description}
                location={location}
                online={online}
                on_demand={on_demand}
                start_date={start_date}
                end_date={end_date}
                href={href}
                image={image}
                key={index}
                favourite={isAllowActivity() ? checkFavourite(title) : undefined}
                read={isAllowActivity() ? checkRead(title) : undefined}
                onRead={(value) => (isAllowActivity() ? updateRead({ title: value }) : undefined)}
                onFavourite={({ title, action }) =>
                  isAllowActivity() ? updateFavourite({ title, action }) : undefined
                }
                onShare={() => setShareItem(href)}
              />
            )
          )}
        </div>
      ) : (
        <NoItemPlaceholder />
      )}
      {shareItem && <ShareModal url={shareItem} onClose={() => setShareItem(null)} />}
    </div>
  );
}

BuildPageSection.propTypes = {
  name: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  items: PropTypes.array,
  href: PropTypes.string.isRequired,
};

BuildPageSection.DefaultProp = {
  items: [],
};
export default BuildPageSection;
