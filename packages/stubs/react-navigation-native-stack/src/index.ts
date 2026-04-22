import { NoopComponent } from '@stub/react-native-screens';

export const createNativeStackNavigator = () => ({
  Navigator: NoopComponent,
  Screen: NoopComponent,
});