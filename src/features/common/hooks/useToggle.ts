import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

type UseToggleReturnType = [boolean, () => void, Dispatch<SetStateAction<boolean>>];

const useToggle = (initialState = false): UseToggleReturnType => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(prevState => !prevState);
  }, []);

  return [state, toggle, setState];
};

export default useToggle;
