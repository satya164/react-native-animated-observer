import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AnimatedToReanimated,
  AnimatedValueObserver,
  PlainValueObserver,
  ReanimatedToAnimated,
  ReanimatedValueObserver,
} from './Examples';

const screens = {
  'Animated to Reanimated': AnimatedToReanimated,
  'Reanimated to Animated': ReanimatedToAnimated,
  'Plain observer': PlainValueObserver,
  'Animated observer': AnimatedValueObserver,
  'Reanimated observer': ReanimatedValueObserver,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    keyof typeof screens | null
  >(null);

  const ScreenComponent = currentScreen ? screens[currentScreen] : null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.container}>
          {ScreenComponent ? (
            <>
              <Pressable
                style={styles.button}
                onPress={() => setCurrentScreen(null)}
              >
                <Text>Back</Text>
              </Pressable>
              <ScreenComponent />
            </>
          ) : (
            Object.keys(screens).map((name) => (
              <React.Fragment key={name}>
                <Pressable
                  style={styles.button}
                  onPress={() => setCurrentScreen(name as keyof typeof screens)}
                >
                  <View>
                    <Text>{name}</Text>
                  </View>
                </Pressable>
                <View style={styles.separator} />
              </React.Fragment>
            ))
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
