import { NoopComponent } from '@stub/react-native-screens';

export const NavigationContainer = NoopComponent;
export const useNavigation = () => ({ navigate: () => {}, goBack: () => {}, setOptions: () => {} });
export const useRoute = () => ({ params: {} });
export const useFocusEffect = () => {};
export const useIsFocused = () => true;
export const useNavigationState = () => ({});
export const ParamListBase = {};
export const StackActions = { push: () => {}, pop: () => {}, replace: () => {} };
export const CommonActions = { navigate: () => {}, goBack: () => {}, reset: () => {} };
export const createNavigatorFactory = (navigator: any) => navigator;