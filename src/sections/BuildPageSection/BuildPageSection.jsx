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

function BuildPageSection({ name, overview, items, href }) {
  const { hackathonsRead, favHackathons, updateFavHackathons, updateReadHackathons } = useUserTrackerContext();
  const headingClasses = clsx('subtitle-bold', styles.headings);
  const overviewClasses = clsx('text-md--long', styles.overview);
  const id = name.replace(/[" "]/g, '').toLowerCase();
  const [shareItem, setShareItem] = useState(null);

  const checkReadHackathon = useCallback(
    (title) => {
      const resp = hackathonsRead && hackathonsRead.find((res) => res.title === title);
      return resp ? true : false;
    },
    [hackathonsRead]
  );
  const checkFavHackathon = useCallback(
    (title) => {
      const resp = favHackathons && favHackathons.find((res) => res.title === title);
      return resp ? true : false;
    },
    [favHackathons]
  );

  const isHackathon = useCallback(() => {
    return user_activities.hackathons === name.toLowerCase();
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
                favourite={isHackathon() ? checkFavHackathon(title) : undefined}
                read={isHackathon() ? checkReadHackathon(title) : undefined}
                onRead={(value) => (isHackathon() ? updateReadHackathons({ title: value }) : undefined)}
                onFavourite={({ title, action }) =>
                  isHackathon() ? updateFavHackathons({ title, action }) : undefined
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
