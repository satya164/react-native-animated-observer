import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';

type ValueChangeEvent = {
  value: Double;
};

interface NativeProps extends ViewProps {
  tag: string;
  value?: Double;
  onValueChange?: DirectEventHandler<ValueChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('AnimatedObserverView');
