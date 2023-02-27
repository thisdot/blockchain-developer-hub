import { useUserTrackerContext } from '@/context/UserTrackerProvider';
import { useCallback } from 'react';

export default function useCheckWorkshop() {
  const { workshopsRead, favWorkshops } = useUserTrackerContext();

  const checkReadWorkshop = useCallback(
    (title) => {
      const resp = workshopsRead && workshopsRead.find((res) => res.title === title);
      return resp ? true : false;
    },
    [workshopsRead]
  );
  const checkFavWorkshop = useCallback(
    (title) => {
      const resp = favWorkshops && favWorkshops.find((res) => res.title === title);
      return resp ? true : false;
    },
    [favWorkshops]
  );

  return [checkReadWorkshop, checkFavWorkshop];
}
