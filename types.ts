// Declaration for CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declaration for global require
declare var require: any;

// Declaration for React Native and Lottie (Mocking types for the Web environment so code compiles)
// In a real RN project, these would be installed via npm
declare module 'react-native' {
  export const View: any;
  export const Image: any;
  export const Animated: any;
  export const StyleSheet: any;
  export const FlatList: any;
  export const Text: any;
  export const Dimensions: any;
  export const Platform: any;
  export const SafeAreaView: any;
  export const StatusBar: any;

  export interface ViewProps { onLayout?: any; style?: any; children?: any; }
  export interface ImageProps { source?: any; style?: any; onLoadEnd?: any; }

  export type StyleProp<T> = any;
  export type ViewStyle = any;
  export type ImageStyle = any;

  export interface ViewToken {
    item: any;
    key: string;
    index: number | null;
    isViewable: boolean;
    section?: any;
  }
}

declare module 'react-native-fast-image' {
  export type Source = number | { uri?: string; headers?: any; priority?: any; cache?: any };
  const FastImage: any;
  export default FastImage;
}

declare module 'lottie-react-native' {
  const LottieView: any;
  export default LottieView;
}

declare module '@react-native-masked-view/masked-view' {
  const MaskedView: any;
  export default MaskedView;
}