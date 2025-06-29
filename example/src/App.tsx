import { View, StyleSheet, Animated, Pressable, Text } from 'react-native';
import {
  AnimatedConverter,
  AnimatedObserver,
} from 'react-native-animated-observer';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const screens = {
    'Home': null,
    'Animated to Reanimated': AnimatedToReanimated,
    'Reanimated to Animated': ReanimatedToAnimated,
    'Plain observer': PlainValueObserver,
    'Animated observer': AnimatedValueObserver,
    'Reanimated observer': ReanimatedValueObserver,
  };

  const [currentScreen, setCurrentScreen] =
    useState<keyof typeof screens>('Home');

  const ScreenComponent = screens[currentScreen];

  return (
    <GestureHandlerRootView style={styles.container}>
      {ScreenComponent ? (
        <>
          <Pressable
            style={styles.button}
            onPress={() => setCurrentScreen('Home')}
          >
            <Text>Back</Text>
          </Pressable>
          <ScreenComponent />
        </>
      ) : (
        <View style={styles.container}>
          {Object.keys(screens).map((screen) => (
            <React.Fragment key={screen}>
              <Pressable
                style={styles.button}
                onPress={() => setCurrentScreen(screen as keyof typeof screens)}
              >
                <Text>{screen}</Text>
              </Pressable>
              <View style={styles.separator} />
            </React.Fragment>
          ))}
        </View>
      )}
    </GestureHandlerRootView>
  );
}

function AnimatedToReanimated() {
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

function ReanimatedToAnimated() {
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

function PlainValueObserver() {
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

function AnimatedValueObserver() {
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

function ReanimatedValueObserver() {
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
  button: {
    padding: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
