// Setup React Native Web for browser environment
import 'react-native-web/dist/index.css';

// Polyfill for AppRegistry if needed
if (typeof document !== 'undefined' && !global.document) {
  Object.assign(global, { document });
}
