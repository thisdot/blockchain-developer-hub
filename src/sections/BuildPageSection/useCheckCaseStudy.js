import { useUserTrackerContext } from '@/context/UserTrackerProvider';
import { useCallback } from 'react';

export default function useCheckCaseStudy() {
  const { caseStudiesRead, favCaseStudies } = useUserTrackerContext();

  const checkReadCaseStudy = useCallback(
    (title) => {
      const resp = caseStudiesRead && caseStudiesRead.find((res) => res.title === title);
      return resp ? true : false;
    },
    [caseStudiesRead]
  );
  const checkFavCaseStudy = useCallback(
    (title) => {
      const resp = favCaseStudies && favCaseStudies.find((res) => res.title === title);
      return resp ? true : false;
    },
    [favCaseStudies]
  );

  return [checkReadCaseStudy, checkFavCaseStudy];
}
