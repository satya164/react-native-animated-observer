import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  AnimatedConverter,
  AnimatedObserver,
} from 'react-native-animated-observer';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export function AnimatedToReanimated() {
  const positionAnimated = useState(() => new Animated.Value(0))[0];
  const positionReanimated = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: positionReanimated.get() }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: positionAnimated } } }],
          { useNativeDriver: true }
        )}
      >
        {Array.from({ length: 100 }).map((_, index) => (
          <View key={index} style={[styles.line]} />
        ))}
      </Animated.ScrollView>
      <Reanimated.View style={[styles.box, styles.reanimated, animatedStyle]} />
      <AnimatedConverter from={positionAnimated} to={positionReanimated} />
    </View>
  );
}

export function ReanimatedToAnimated() {
  const positionAnimated = useState(() => new Animated.Value(0))[0];
  const positionReanimated = useSharedValue(0);

  const pan = Gesture.Pan().onUpdate((e) => {
    positionReanimated.set(e.absoluteX);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionReanimated.get() }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <Reanimated.View
          style={[styles.box, styles.reanimated, animatedStyle]}
        />
        <Animated.View
          style={[
            styles.box,
            styles.animated,
            {
              transform: [{ translateX: positionAnimated }],
            },
          ]}
        />
        <AnimatedConverter from={positionReanimated} to={positionAnimated} />
      </View>
    </GestureDetector>
  );
}

export function PlainValueObserver() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatedObserver
      value={value}
      onValueChange={(e) => {
        console.log('PlainObserver onValueChange', e.nativeEvent.value);
      }}
    />
  );
}

export function AnimatedValueObserver() {
  const ref = useRef(0);
  const value = useState(() => new Animated.Value(ref.current))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      value.setValue(++ref.current);
    }, 3000);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <AnimatedObserver
      value={value}
      onValueChange={(e) => {
        console.log('AnimatedObserver onValueChange', e.nativeEvent.value);
      }}
    />
  );
}

export function ReanimatedValueObserver() {
  const value = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      value.set(value.get() + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <AnimatedObserver
      value={value}
      onValueChange={(e) => {
        console.log('ReanimatedObserver onValueChange', e.nativeEvent.value);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  content: {
    gap: 10,
    padding: 10,
  },
  line: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  reanimated: {
    backgroundColor: 'tomato',
  },
  animated: {
    top: 10,
    left: 70,
    backgroundColor: 'blue',
  },
});
