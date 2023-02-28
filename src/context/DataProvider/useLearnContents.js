import { useEffect, useState } from 'react';
import learnData from '@/data/learn.yaml';
import external_case_studies from '@/data/case-studies.yaml';
import buildData from '@/data/build.yaml';
import { user_activities } from 'server/activities';

//Here we are saving all contents or articles to the db is they don't exist. This action happend on page first load.

export default function useLearnContents(data) {
  const { resources } = learnData;
  const { categories } = buildData;
  const workshopsData = categories.find((res) => res.name.toLowerCase() === user_activities.workshops);
  const { items: workshopsItems } = workshopsData;
  let case_studies = {};
  if (data) {
    case_studies = {
      ...data,
    };
    case_studies.items = [...case_studies.items, ...external_case_studies.items];
  }
  const { items } = case_studies;
  const [newCourses, setNewCourses] = useState([]);
  const [newTutorials, setNewTutorials] = useState([]);
  const [newWorkshops, setNewWorkshops] = useState([]);
  const [newCaseStudies, setNewCaseStudies] = useState([]);

  const saveCourses = async () => {
    resources.forEach(async ({ courses }) => {
      courses.data.forEach(async (data) => {
        const resp = await fetch('/api/courses/add', {
          method: 'POST',
          body: JSON.stringify({
            course: data,
          }),
        });
        const status = resp.status;
        if (status === 200) {
          // its a new course
          setNewCourses([...newCourses, data]);
        }
      });
    });
  };
  const saveTutorials = async () => {
    resources.forEach(async ({ tutorials }) => {
      tutorials.data.forEach(async (data) => {
        const resp = await fetch('/api/tutorials/add', {
          method: 'POST',
          body: JSON.stringify({
            tutorial: data,
          }),
        });
        const status = resp.status;
        if (status === 200) {
          // its a new tutorial
          setNewTutorials([...newTutorials, data]);
        }
      });
    });
  };

  const saveWorkshops = async () => {
    workshopsItems.forEach(async (data) => {
      const resp = await fetch('/api/workshops/add', {
        method: 'POST',
        body: JSON.stringify({
          workshop: data,
        }),
      });
      const status = resp.status;
      if (status === 200) {
        // its a new workshop
        setNewWorkshops([...newWorkshops, data]);
      }
    });
  };
  const saveCaseStudies = async () => {
    items &&
      items.forEach(async (data) => {
        const resp = await fetch('/api/case-studies/add', {
          method: 'POST',
          body: JSON.stringify({
            case_study: data,
          }),
        });
        const status = resp.status;
        if (status === 200) {
          // its a new case study
          setNewCaseStudies([...newCaseStudies, data]);
        }
      });
  };

  useEffect(() => {
    async function saveData() {
      await saveCourses();
      await saveTutorials();
      await saveWorkshops();
      await saveCaseStudies();
    }
    saveData();
  }, []);

  return [
    newCourses,
    newTutorials,
    newWorkshops,
    newCaseStudies,
    setNewWorkshops,
    setNewCaseStudies,
    setNewCourses,
    setNewTutorials,
  ];
}
