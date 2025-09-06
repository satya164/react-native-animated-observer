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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

export function AnimatedToReanimated() {
  const { width } = useWindowDimensions();

  const positionAnimated = useState(() => new Animated.Value(0))[0];
  const positionReanimated = useSharedValue(0);

  return (
    <View style={styles.container}>
      <AnimatedConverter from={positionAnimated} to={positionReanimated} />
      <Boxes
        animatedValue={positionAnimated}
        sharedValue={positionReanimated}
      />
      <Animated.ScrollView
        horizontal
        contentContainerStyle={[styles.content, { width: width * 2 - 130 }]}
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
  const positionAnimated = useState(() => new Animated.Value(0))[0];
  const positionReanimated = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((e) => {
      positionReanimated.set(Math.abs(e.translationX));
    })
    .onFinalize(() => {
      positionReanimated.set(withSpring(0));
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <AnimatedConverter from={positionReanimated} to={positionAnimated} />
        <Boxes
          animatedValue={positionAnimated}
          sharedValue={positionReanimated}
        />
      </View>
    </GestureDetector>
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

function ObserverDisplay({
  value,
}: {
  value: number | Animated.Value | SharedValue<number>;
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
    backgroundColor: '#f78c6c',
  },
  animated: {
    backgroundColor: '#82aaff',
  },
});
