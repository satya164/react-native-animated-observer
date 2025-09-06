# react-native-animated-observer

[![npm][version-badge]][version]
[![MIT License][license-badge]][license]

Helpers that let you observe value of an [`Animated.Value`][animated.value] or [`SharedValue`][reanimated.sharedvalue] and convert between them using native events.

## Use case

If you use a component that uses [`Animated`](https://reactnative.dev/docs/animated) and accepts animated values or styles, but you use [`Reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/) for your app's animations, or vice versa. You can convert your values with this library to work with the component.

## Installation

```sh
npm install react-native-animated-observer
```

## API

The library exports the following components:

### `AnimatedConverter`

A component that converts between an [`Animated.Value`][animated.value] and a [`SharedValue`][reanimated.sharedvalue] natively.

It accepts the following props:

- `from`
- `to`

The `from` and `to` props need to be a pair of [`Animated.Value`][animated.value] and [`SharedValue`][reanimated.sharedvalue] or vice versa. The value passed to `from` will be used to update the value of `to`.

Usage:

```js
import { AnimatedConverter } from 'react-native-animated-observer';

// ...
const animatedValue = useRef(new Animated.Value(0)).current;
const reanimatedSharedValue = useSharedValue(0);

// ...

<AnimatedConverter from={animatedValue} to={reanimatedSharedValue} />;
```

### `AnimatedObserver`

A component that observes changes in a given value and emits an event when the value changes. This is the building block for `AnimatedConverter`.

It accepts the following props:

- `value`: The value to observe. It can be a `number`, [`Animated.Value`][animated.value], or [`SharedValue`][reanimated.sharedvalue].
- `onValueChange`: A callback function that is called when the observed value changes.

Usage:

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

## How it works

The library uses the native event system to observe changes in the values of [`Animated.Value`][animated.value] and [`SharedValue`][reanimated.sharedvalue]. When a value changes, the library emits an event that can be listened to by the components.

This event is then used with [`Animated.event`](https://reactnative.dev/docs/animated#event) (with native driver) or [`useEvent`](https://docs.swmansion.com/react-native-reanimated/docs/advanced/useEvent) to update [`Animated.Value`][animated.value] or [`SharedValue`][reanimated.sharedvalue] respectively depending on the usage.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

[animated.value]: https://reactnative.dev/docs/animated#value
[reanimated.sharedvalue]: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/
[version-badge]: https://img.shields.io/npm/v/react-native-animated-observer.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-native-animated-observer.svg?style=flat-square
[version]: https://www.npmjs.com/package/react-native-animated-observer
[license]: https://opensource.org/licenses/MIT
