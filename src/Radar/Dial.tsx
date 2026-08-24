import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const GREEN = '#00ff66';
// the native driver is not available on web, and warns when asked for
const NATIVE_DRIVER = Platform.OS !== 'web';

export const SWEEP_MS = 4000;
const CENTER = 50;
const RADIUS = 45;
const RINGS = [15, 30, RADIUS];
const SPOKES = [45, 135];
// the wedge behind the leading edge, drawn as steps that fade out
const TRAIL = [10, 20, 30, 40, 50, 60];

interface Props {
  size: number;
}

export function Dial({ size }: Props) {
  const square = { width: size, height: size };

  return (
    <Animated.View testID='radar-dial' style={square}>
      <Grid />
      <Sweep />
    </Animated.View>
  );
}

function Grid() {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox='0 0 100 100'>
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill='black'
        stroke={GREEN}
        strokeWidth={6}
        strokeOpacity={0.06}
      />
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill='none'
        stroke={GREEN}
        strokeWidth={3}
        strokeOpacity={0.12}
      />

      {RINGS.map((radius) => (
        <Circle
          key={radius}
          cx={CENTER}
          cy={CENTER}
          r={radius}
          fill='none'
          stroke={GREEN}
          strokeWidth={0.5}
          strokeOpacity={0.5}
        />
      ))}

      <Line
        x1={CENTER - RADIUS}
        y1={CENTER}
        x2={CENTER + RADIUS}
        y2={CENTER}
        stroke={GREEN}
        strokeWidth={0.5}
        strokeOpacity={0.5}
      />
      <Line
        x1={CENTER}
        y1={CENTER - RADIUS}
        x2={CENTER}
        y2={CENTER + RADIUS}
        stroke={GREEN}
        strokeWidth={0.5}
        strokeOpacity={0.5}
      />

      {SPOKES.map((angle) => {
        const [x1, y1] = edge(angle);
        const [x2, y2] = edge(angle + 180);

        return (
          <Line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={GREEN}
            strokeWidth={0.3}
            strokeOpacity={0.25}
          />
        );
      })}
    </Svg>
  );
}

function Sweep() {
  const turn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(turn, {
        toValue: 1,
        duration: SWEEP_MS,
        easing: Easing.linear,
        useNativeDriver: NATIVE_DRIVER,
      })
    );

    spin.start();
    return () => spin.stop();
  }, [turn]);

  const rotate = turn.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}
    >
      <Svg style={StyleSheet.absoluteFill} viewBox='0 0 100 100'>
        {TRAIL.map((angle, index) => (
          <Path
            key={angle}
            d={wedge(-angle, -angle + 10)}
            fill={GREEN}
            fillOpacity={0.28 * (1 - index / TRAIL.length)}
          />
        ))}

        <Line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER}
          y2={CENTER - RADIUS}
          stroke={GREEN}
          strokeWidth={0.8}
        />
      </Svg>
    </Animated.View>
  );
}

// degrees clockwise from the top of the dial
function edge(angle: number): [number, number] {
  const radians = (angle * Math.PI) / 180;
  return [
    CENTER + RADIUS * Math.sin(radians),
    CENTER - RADIUS * Math.cos(radians),
  ];
}

function wedge(from: number, to: number): string {
  const [x1, y1] = edge(from);
  const [x2, y2] = edge(to);

  return `M${CENTER},${CENTER} L${x1},${y1} A${RADIUS},${RADIUS} 0 0 1 ${x2},${y2} Z`;
}
