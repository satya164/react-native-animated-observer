import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

type ValueChangeEvent = {
  value: CodegenTypes.Double;
};

export interface NativeProps extends ViewProps {
  tag: string;
  value?: CodegenTypes.Double;
  onValueChange?: CodegenTypes.DirectEventHandler<ValueChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('AnimatedObserverView');
