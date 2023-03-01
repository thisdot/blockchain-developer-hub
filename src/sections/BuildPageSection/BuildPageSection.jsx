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
import { useDataContext } from '@/context/DataProvider';
import isNewContent from '@/helpers/isNewContent';

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
  const { newWorkshops, newCaseStudies, userId, lastLogIn } = useDataContext();
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

  const getItems = useCallback(() => {
    let sorted_items = items.slice();

    const isCaseStudies = user_activities.case_studies === name.toLowerCase();
    const isWorkshops = user_activities.workshops === name.toLowerCase();

    if ((isCaseStudies || isWorkshops) && userId) {
      const filter = isCaseStudies ? newCaseStudies : newWorkshops;
      const favouriteItems = sorted_items.filter(({ title }) => {
        const result = isNewContent(filter, lastLogIn, title);
        if (checkFavourite(title) && !result) return true;
      });
      const newFilteredItems = sorted_items.filter((data) => {
        const result = isNewContent(filter, lastLogIn, data.title);
        if (result && !checkFavourite(data.title)) {
          data.isNew = true;
          return true;
        }
      });
      const newAndFav = sorted_items.filter((data) => {
        const result = isNewContent(filter, lastLogIn, data.title);
        if (result && checkFavourite(data.title)) {
          data.isNew = true;
          return true;
        }
      });
      const otherItems = sorted_items.filter(({ title }) => {
        const result = isNewContent(filter, lastLogIn, title);
        if (!result && !checkFavourite(title)) return true;
      });

      sorted_items = [...newAndFav, ...favouriteItems, ...newFilteredItems, ...otherItems];
    }

    return sorted_items;
  }, [favWorkshops, favCaseStudies, newWorkshops, newCaseStudies, userId, lastLogIn]);

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
      {getItems().length ? (
        <div className={styles.cards}>
          {getItems().map(
            (
              { title, prize, image, description, location, online, on_demand, start_date, end_date, href, isNew },
              index
            ) => (
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
                isNew={isNew}
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
