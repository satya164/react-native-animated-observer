# react-native-animated-observer

Helpers that let you observe value of an [`Animated.Value`][animated.value] or [`SharedValue`][reanimated.sharedvalue] and convert between them using native events.

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

The `from` and `to` props need to be a pair of [`Animated.Value`][animated.value] and [`SharedValue`][reanimated.sharedvalue] respectively.

Usage:

```js
import { AnimatedConverter } from 'react-native-animated-observer';

// ...

<AnimatedConverter from={animatedValue} to={reanimatedSharedValue} />;
```

### `AnimatedObserver`

A component that observes changes in a given value and emits an event when the value changes. This is the building block for `AnimatedConverter`.

It accepts the following props:

- `value`: The value to observe. It can be a `number`, [`Animated.Value`][animated.value], or [`SharedValue`][reanimated.sharedvalue].
- `onValueChange`: A callback function that is called when the observed value changes. This function can integrate with [`Animated.event`](https://reactnative.dev/docs/animated#event) or [`useEvent`](https://docs.swmansion.com/react-native-reanimated/docs/advanced/useEvent).

Usage:

```js
import { AnimatedObserver } from 'react-native-animated-observer';

// ...

<AnimatedObserver
  value={animatedValue}
  onValueChange={(e) => console.log(e.nativeEvent.value)}
/>;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

[animated.value]: https://reactnative.dev/docs/animated#value
[reanimated.sharedvalue]: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/
