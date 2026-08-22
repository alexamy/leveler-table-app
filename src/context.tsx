import { ReactNode, createContext, useContext, useReducer } from 'react';
import { UseReducerResult, State, defaultState, appReducer } from './reducer';

const AppContext = createContext<UseReducerResult | null>(null);

interface Props {
  initialState?: State;
  children: ReactNode;
}

export function AppContextProvider({
  initialState = defaultState,
  children,
}: Props) {
  const reducer = useReducer(appReducer, initialState);
  return <AppContext.Provider value={reducer}>{children}</AppContext.Provider>;
}

export function useAppState(): UseReducerResult {
  const reducer = useContext(AppContext);
  if (reducer === null) {
    throw new Error('useAppState must be used with AppContextProvider.');
  }

  return reducer;
}
