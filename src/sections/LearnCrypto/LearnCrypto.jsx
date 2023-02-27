import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from '@/components/Card';
import styles from './LearnCrypto.module.css';
import ShareModal from '@/components/ShareModal';
import { useCallback, useState } from 'react';
import NoItemPlaceholder from '@/components/NoItemPlaceholder';
import HeadingHash from '@/components/HeadingHash';
import { useUserTrackerContext } from '@/context/UserTrackerProvider';
import { useDataContext } from '@/context/DataProvider';
import isRecentDate from '@/helpers/isRecentDate';

function LearnCrypto({ id, name, logo, logoAlt, courses, tutorials }) {
  const {
    favCourses,
    favTutorials,
    coursesRead,
    tutorialsRead,
    updateReadCourses,
    updateReadTutorials,
    updateFavCourses,
    updateFavTutorials,
  } = useUserTrackerContext();
  const { userId, lastLogin } = useDataContext();
  const headingClasses = clsx('subtitle-bold', styles.headings);
  const overviewClasses = clsx('text-md--long', styles.overview);
  const [shareItem, setShareItem] = useState(null);

  const checkReadCourse = useCallback(
    (title) => {
      const resp = coursesRead && coursesRead.find((res) => res.title === title);
      return resp ? true : false;
    },
    [coursesRead]
  );
  const checkFavCourse = useCallback(
    (title) => {
      const resp = favCourses && favCourses.find((res) => res.title === title);
      return resp ? true : false;
    },
    [favCourses]
  );
  const checkReadTutorial = useCallback(
    (title) => {
      const resp = tutorialsRead && tutorialsRead.find((res) => res.title === title);
      return resp ? true : false;
    },
    [tutorialsRead]
  );
  const checkFavTutorial = useCallback(
    (title) => {
      const resp = favTutorials && favTutorials.find((res) => res.title === title);
      return resp ? true : false;
    },
    [favTutorials]
  );

  const getCourses = useCallback(() => {
    let courses_data = courses?.data.slice();
    if (userId) {
      const seenCourses = courses_data.filter(({ title }) => checkReadCourse(title));
      const newCourses = courses_data.filter(({ date }) => date && isRecentDate(date, lastLogin));
      const otherCourses = courses_data.filter(({ date, title }) => !date && checkReadCourse(title) === false);

      courses_data = [...newCourses, ...otherCourses, ...seenCourses];
    }
    return courses_data;
  }, [userId, lastLogin, coursesRead]);

  const getTutorials = useCallback(() => {
    let tutorials_data = tutorials?.data.slice();
    if (userId) {
      const seenTutorials = tutorials_data.filter(({ title }) => checkReadTutorial(title));
      const newTutorials = tutorials_data.filter(({ date }) => date && isRecentDate(date, lastLogin));
      const otherTutorials = tutorials_data.filter(({ date, title }) => !date && checkReadTutorial(title) === false);

      tutorials_data = [...newTutorials, ...otherTutorials, ...seenTutorials];
    }
    return tutorials_data;
  }, [userId, lastLogin, tutorialsRead]);

  return (
    <div id={id} className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.sectionHeading}>
          <h2 className="subtitle-bold">{name}</h2>
          <img src={logo} alt={logoAlt} className={styles.logo} />
        </div>
        {courses && (
          <div id={`${id}-courses`}>
            <h3 className={headingClasses}>
              <HeadingHash to={courses.href} />
              Courses
            </h3>
            {courses.overview && <p className={overviewClasses}>{courses.overview}</p>}
            {getCourses() ? (
              <div className={styles.cards}>
                {getCourses().map(({ title, author, image, level, description, href }, index) => (
                  <Card
                    title={title}
                    subtitle={author}
                    description={description}
                    level={level}
                    image={image}
                    href={href}
                    key={index}
                    favourite={checkFavCourse(title)}
                    read={checkReadCourse(title)}
                    onRead={(value) => updateReadCourses({ title: value })}
                    onFavourite={({ title, action }) => updateFavCourses({ title, action })}
                    onShare={() => setShareItem(href)}
                  />
                ))}
              </div>
            ) : (
              <NoItemPlaceholder />
            )}
          </div>
        )}

        {tutorials && (
          <div id={`${id}-tutorials`}>
            <h3 className={headingClasses}>
              <HeadingHash to={tutorials.href} />
              Tutorials
            </h3>
            {tutorials.overview && <p className={overviewClasses}>{tutorials.overview}</p>}
            {getTutorials() ? (
              <div className={styles.cards}>
                {getTutorials().map(({ title, author, description, href }, index) => (
                  <Card
                    title={title}
                    subtitle={author}
                    href={href}
                    description={description}
                    onShare={() => setShareItem(href)}
                    key={index}
                    favourite={checkFavTutorial(title)}
                    read={checkReadTutorial(title)}
                    onRead={(value) => updateReadTutorials({ title: value })}
                    onFavourite={({ title, action }) => updateFavTutorials({ title, action })}
                  />
                ))}
              </div>
            ) : (
              <NoItemPlaceholder />
            )}
          </div>
        )}
      </div>
      {shareItem && <ShareModal url={shareItem} onClose={() => setShareItem(null)} />}
    </div>
  );
}

LearnCrypto.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  logoAlt: PropTypes.string.isRequired,
  courses: PropTypes.object,
  tutorials: PropTypes.object,
};

export default LearnCrypto;
