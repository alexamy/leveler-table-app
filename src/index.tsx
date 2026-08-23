import { ReactNode } from 'react';
import { useLoadState, useSaveState } from './persistance';
import { ActivityIndicator, View } from 'react-native';
import { AppContextProvider, useAppState } from './context';
import { Table } from './Table';
import { State } from './reducer';

export function App() {
  const { state, isLoading } = useLoadState();
  if (isLoading) return <Loading />;

  return (
    <Root state={state}>
      <StatePersistence />
    </Root>
  );
}

interface RootProps {
  state?: State;
  children?: ReactNode;
}

export function Root({ state, children }: RootProps) {
  return (
    <AppContextProvider initialState={state}>
      {children}
      <Table />
    </AppContextProvider>
  );
}

function StatePersistence() {
  const [state] = useAppState();
  useSaveState(state);
  return null;
}

function Loading() {
  return (
    <View>
      <ActivityIndicator size='large' />
    </View>
  );
}
