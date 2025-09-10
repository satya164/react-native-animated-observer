import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  AnimatedConverter,
  AnimatedObserver,
} from 'react-native-animated-observer';
import Reanimated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollOffset,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

export function AnimatedToReanimated() {
  const { width } = useWindowDimensions();

  const scrollWidth = useScrollWidth();

  const positionAnimated = useState(() => new Animated.Value(0))[0];
  const positionReanimated = useSharedValue(0);

  const positionAnimatedInterpolated = positionAnimated.interpolate({
    inputRange: [0, scrollWidth - width],
    outputRange: [1, 0],
  });

  const positionReanimatedInterpolated = useSharedValue(scrollWidth);

  return (
    <View style={styles.container}>
      <AnimatedConverter from={positionAnimated} to={positionReanimated} />
      <AnimatedConverter
        from={positionAnimatedInterpolated}
        to={positionReanimatedInterpolated}
      />
      <ProgressBarReanimated value={positionReanimatedInterpolated} />
      <Boxes
        animatedValue={positionAnimated}
        sharedValue={positionReanimated}
      />
      <Animated.ScrollView
        horizontal
        contentContainerStyle={[styles.content, { width: scrollWidth }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: positionAnimated } } }],
          { useNativeDriver: true }
        )}
      >
        <View />
      </Animated.ScrollView>
    </View>
  );
}

export function ReanimatedToAnimated() {
  const { width } = useWindowDimensions();

  const scrollWidth = useScrollWidth();
  const scrollRef = useAnimatedRef();

  const positionReanimated = useScrollOffset(scrollRef);
  const positionAnimated = useState(() => new Animated.Value(0))[0];

  const positionReanimatedInterpolated = useDerivedValue(() => {
    return interpolate(
      positionReanimated.value,
      [0, scrollWidth - width],
      [1, 0]
    );
  });

  const positionAnimatedInterpolated = useState(() => new Animated.Value(1))[0];

  return (
    <View style={styles.container}>
      <AnimatedConverter from={positionReanimated} to={positionAnimated} />
      <AnimatedConverter
        from={positionReanimatedInterpolated}
        to={positionAnimatedInterpolated}
      />
      <ProgressBarAnimated value={positionAnimatedInterpolated} />
      <Boxes
        animatedValue={positionAnimated}
        sharedValue={positionReanimated}
      />
      <Animated.ScrollView
        horizontal
        contentContainerStyle={[styles.content, { width: scrollWidth }]}
        // @ts-expect-error the types are wrong
        ref={scrollRef}
      >
        <View />
      </Animated.ScrollView>
    </View>
  );
}

export function PlainValueObserver() {
  const [value, setValue] = useState(0);

  useInterval(() => {
    setValue((prev) => prev + 1);
  });

  return <ObserverDisplay value={value} />;
}

export function AnimatedValueObserver() {
  const ref = useRef(0);
  const value = useState(() => new Animated.Value(ref.current))[0];

  useInterval(() => {
    value.setValue(++ref.current);
  });

  return <ObserverDisplay value={value} />;
}

export function ReanimatedValueObserver() {
  const value = useSharedValue(0);

  useInterval(() => {
    value.set(value.get() + 1);
  });

  return <ObserverDisplay value={value} />;
}

function Boxes({
  animatedValue,
  sharedValue,
}: {
  animatedValue: Animated.Value;
  sharedValue: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sharedValue.get() }],
    };
  });

  return (
    <View style={styles.boxes}>
      <Animated.View
        style={[
          styles.box,
          styles.animated,
          { transform: [{ translateX: animatedValue }] },
        ]}
      >
        <Text style={styles.label}>A</Text>
      </Animated.View>
      <Reanimated.View style={[styles.box, styles.reanimated, animatedStyle]}>
        <Text style={styles.label}>R</Text>
      </Reanimated.View>
    </View>
  );
}

function ProgressBarAnimated({ value }: { value: Animated.Node }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[
          styles.progress,
          {
            transform: [{ translateX: Animated.multiply(value, -width) }],
          },
        ]}
      />
    </View>
  );
}

function ProgressBarReanimated({ value }: { value: SharedValue<number> }) {
  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.get() * -width }],
    };
  });

  return (
    <View style={styles.progressBar}>
      <Reanimated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
}

function ObserverDisplay({
  value,
}: {
  value: number | Animated.Node | Omit<SharedValue<number>, 'set'>;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  return (
    <View style={styles.centered}>
      <AnimatedObserver
        value={value}
        onValueChange={(e) => {
          setDisplayValue(e.nativeEvent.value);
        }}
      />
      <Text style={styles.value}>{displayValue}</Text>
    </View>
  );
}

function useScrollWidth() {
  const { width } = useWindowDimensions();

  return width * 2 - 130;
}

function useInterval(callback: () => void, delay: number = 1000) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 10,
    padding: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxes: {
    margin: 10,
    gap: 10,
    flexDirection: 'row',
  },
  box: {
    width: 50,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: 'white',
  },
  reanimated: {
    backgroundColor: '#FF1744',
  },
  animated: {
    backgroundColor: '#304FFE',
  },
  progressBar: {
    height: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#212121',
  },
});
