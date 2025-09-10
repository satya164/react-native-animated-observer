# react-native-animated-observer

[![npm][version-badge]][version]
[![MIT License][license-badge]][license]

Helpers that let you observe [Animated][animated] and [Reanimated][reanimated] values and convert between them.

## Use case

This library is useful when you have a component that uses [Animated][animated] and accepts animated values or styles, but you use [Reanimated][reanimated] for your app's animations, or vice versa. You can use this library to convert your values to work with the component.

## Installation

```sh
npm install react-native-animated-observer
```

## API

The library exports the following components:

### `AnimatedConverter`

A component that converts between an [`Animated.Node`][animated.node] and a [`SharedValue<number>`][reanimated.sharedvalue] natively.

**Usage:**

```js
import { AnimatedConverter } from 'react-native-animated-observer';

// ...
const animatedValue = useRef(new Animated.Value(0)).current;
const reanimatedSharedValue = useSharedValue(0);

// ...

<AnimatedConverter from={animatedValue} to={reanimatedSharedValue} />;
```

It accepts the following props:

#### `from`

Value to read and observe changes from. It can be one of the following:

- [`Animated.Node`][animated.node] - [`Animated.Value`][animated.value] or result of modifications such as interpolation (`Animated.AnimatedInterpolation`), addition (`Animated.AnimatedAddition`), etc.
- [`SharedValue<number>`][reanimated.sharedvalue] or [`DerivedValue<number>`][reanimated.derivedvalue]

#### `to`

Value to update when the [`from`](#from) value changes. It can be one of the following:

- [`Animated.Value`][animated.value]
- [`SharedValue<number>`][reanimated.sharedvalue]

### `AnimatedObserver`

A component that observes changes in a given value and emits an event when the value changes. This is the building block for `AnimatedConverter`.

**Usage:**

```js
import { AnimatedObserver } from 'react-native-animated-observer';

// ...

const animatedValue = useRef(new Animated.Value(0)).current;

// ...

<AnimatedObserver
  value={animatedValue}
  onValueChange={(e) => console.log(e.nativeEvent.value)}
/>;
```

It accepts the following props:

#### `value`

The value to observe.

It can be a `number`, [`Animated.Node`][animated.node] for [Animated][animated], [`SharedValue<number>`][reanimated.sharedvalue] or [`DerivedValue<number>`][reanimated.derivedvalue] for [Reanimated][reanimated].

#### `onValueChange`

A callback function that is called when the observed value changes.

## How it works

The library renders a native component that receives an [`Animated.Node`][animated.node] or [`SharedValue<number>`][reanimated.sharedvalue] value. When the value changes, the library dispatches an event with this value.

This event is then used with [`Animated.event`][animated.event] (with native driver) or [`useEvent`][reanimated.useevent] to update [`Animated.Value`][animated.value] or [`SharedValue<number>`][reanimated.sharedvalue] respectively, depending on the usage.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

[animated]: https://reactnative.dev/docs/animated
[reanimated]: https://docs.swmansion.com/react-native-reanimated/docs/
[animated.node]: https://reactnative.dev/docs/animated#node
[animated.value]: https://reactnative.dev/docs/animated#value
[animated.event]: https://reactnative.dev/docs/animated#event
[reanimated.sharedvalue]: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/
[reanimated.derivedvalue]: https://docs.swmansion.com/react-native-reanimated/docs/core/useDerivedValue
[reanimated.useevent]: https://docs.swmansion.com/react-native-reanimated/docs/advanced/useEvent
[version-badge]: https://img.shields.io/npm/v/react-native-animated-observer.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-native-animated-observer.svg?style=flat-square
[version]: https://www.npmjs.com/package/react-native-animated-observer
[license]: https://opensource.org/licenses/MIT
