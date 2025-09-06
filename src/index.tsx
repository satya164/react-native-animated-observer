import { useId } from 'react';
import { Animated } from 'react-native';
import Reanimated, {
  isSharedValue,
  useEvent,
  useHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { default as ObserverView } from './AnimatedObserverViewNativeComponent';

type AnimatedObserverProps = {
  value: Animated.Value | SharedValue<number> | number;
  onValueChange: NonNullable<
    | React.ComponentProps<typeof ObserverView>['onValueChange']
    | React.ComponentProps<typeof AnimatedObserverViewInternal>['onValueChange']
    | React.ComponentProps<
        typeof ReanimatedObserverViewInternal
      >['onValueChange']
  >;
};

export function AnimatedObserver({
  value,
  onValueChange,
}: AnimatedObserverProps) {
  const tag = useId();

  return (
    <>
      {typeof value === 'number' ? (
        <ObserverView tag={tag} value={value} />
      ) : isSharedValue<number>(value) ? (
        // @ts-expect-error - component has incorrect type for value prop
        <ReanimatedObserverViewInternal tag={tag} value={value} />
      ) : (
        <AnimatedObserverViewInternal tag={tag} value={value} />
      )}
      {typeof onValueChange === 'function' ? (
        <ObserverView tag={tag} onValueChange={onValueChange} />
      ) : onValueChange.constructor.name === 'AnimatedEvent' ? (
        // @ts-expect-error - component has incorrect type for onValueChange prop
        <AnimatedObserverViewInternal tag={tag} onValueChange={onValueChange} />
      ) : (
        <ReanimatedObserverViewInternal
          tag={tag}
          onValueChange={onValueChange}
        />
      )}
    </>
  );
}

type AnimatedConverterProps =
  | AnimatedToReanimatedProps
  | ReanimatedToAnimatedProps;

export function AnimatedConverter(props: AnimatedConverterProps) {
  if (isSharedValue<number>(props.from) && !isSharedValue<number>(props.to)) {
    return <ReanimatedToAnimated from={props.from} to={props.to} />;
  }

  if (!isSharedValue<number>(props.from) && isSharedValue<number>(props.to)) {
    return <AnimatedToReanimated from={props.from} to={props.to} />;
  }

  throw new Error(
    'The `from` and `to` props must be a pair of Animated.Value and SharedValue.'
  );
}

type AnimatedToReanimatedProps = {
  from: Animated.Value;
  to: SharedValue<number>;
};

type ValueChangeReanimatedEvent = {
  value: number;
  eventName: typeof EVENT_NAME;
};

const EVENT_NAME = 'onValueChange' as const;

function AnimatedToReanimated({
  from: animatedValue,
  to: reanimatedValue,
}: AnimatedToReanimatedProps) {
  const onValueChange = (e: ValueChangeReanimatedEvent) => {
    'worklet';

    reanimatedValue.set(e.value);
  };

  const { doDependenciesDiffer } = useHandler({ onValueChange });

  const handler = useEvent<ValueChangeReanimatedEvent>(
    onValueChange,
    [EVENT_NAME],
    doDependenciesDiffer
  );

  // FIXME: What's the correct type?
  // @ts-expect-error - component has incorrect type for onValueChange prop
  return <AnimatedObserver value={animatedValue} onValueChange={handler} />;
}

type ReanimatedToAnimatedProps = {
  from: SharedValue<number>;
  to: Animated.Value;
};

function ReanimatedToAnimated({
  from: reanimatedValue,
  to: animatedValue,
}: ReanimatedToAnimatedProps) {
  const onValueChange = Animated.event(
    [{ nativeEvent: { value: animatedValue } }],
    { useNativeDriver: true }
  );

  return (
    <AnimatedObserver value={reanimatedValue} onValueChange={onValueChange} />
  );
}

const AnimatedObserverViewInternal =
  Animated.createAnimatedComponent(ObserverView);

const ReanimatedObserverViewInternal =
  Reanimated.createAnimatedComponent(ObserverView);
