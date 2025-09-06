import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AnimatedToReanimated,
  AnimatedValueObserver,
  PlainValueObserver,
  ReanimatedToAnimated,
  ReanimatedValueObserver,
} from './Examples';
import backIcon from './assets/back-icon.png';

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
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {ScreenComponent ? (
          <>
            <View style={styles.header}>
              <Pressable
                style={styles.button}
                onPress={() => setCurrentScreen(null)}
              >
                <Image source={backIcon} style={styles.icon} />
              </Pressable>
              <Text style={styles.title}>{currentScreen}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.screen}>
              <ScreenComponent />
            </View>
          </>
        ) : (
          Object.keys(screens).map((name) => (
            <React.Fragment key={name}>
              <Pressable
                style={styles.pressable}
                onPress={() => setCurrentScreen(name as keyof typeof screens)}
              >
                <Text style={styles.label}>{name}</Text>
              </Pressable>
              <View style={styles.separator} />
            </React.Fragment>
          ))
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
  },
  pressable: {
    padding: 16,
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    margin: 14,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
  },
  label: {
    fontSize: 18,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
