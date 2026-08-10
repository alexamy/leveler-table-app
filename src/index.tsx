import { useStatePersistance } from './persistance';
import { ActivityIndicator, View } from 'react-native';
import { AppContextProvider } from './context';
import { Table } from './Table';

export function App() {
  const [state, isLoading] = useStatePersistance();
  if (isLoading) return <Loading />;

  return (
    <AppContextProvider initialState={state}>
      <Table />
    </AppContextProvider>
  );
}

function Loading() {
  return (
    <View>
      <ActivityIndicator size='large' />
    </View>
  );
}
