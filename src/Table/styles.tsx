import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  top: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottom: {
    marginTop: 20,
    marginBottom: 40,
  },
  table: {
    alignSelf: 'stretch',
    width: '100%',
    flexGrow: 0,
  },
  headRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  position: {
    width: '8%',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 7,
  },
  result: {
    width: '20%',
    fontSize: 18,
    textAlign: 'right',
    paddingTop: 7,
    marginRight: 10,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 0,
    flexGrow: 0,
    flexShrink: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  bottomIcon: {
    width: '25%',
    marginHorizontal: 10,
  },
});
