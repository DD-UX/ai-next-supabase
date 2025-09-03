import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';

type UseToggleReturnType = [boolean, () => void, Dispatch<SetStateAction<boolean>>];

const useToggle = (initialState = false): UseToggleReturnType => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, toggle, setState];
};

export default useToggle;
