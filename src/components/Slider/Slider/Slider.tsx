import React, { forwardRef, useRef, useState, useCallback } from "react";
import { useMove, clamp, useUncontrolled, useMergedRef } from "../../../hooks";

import {
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  useComponentDefaultProps,
  useMantineTheme,
} from "@mantine/styles";
import { getPosition } from "../utils/get-position/get-position";
import { getChangeValue } from "../utils/get-change-value/get-change-value";
import { Thumb, ThumbStylesNames } from "../Thumb/Thumb";
import { Track, TrackStylesNames } from "../Track/Track";
import { MarksStylesNames } from "../Marks/Marks";
import useStyles from "./Slider.styles";

export type SliderStylesNames = ThumbStylesNames | TrackStylesNames | MarksStylesNames;

export interface SliderProps
  extends DefaultProps<SliderStylesNames>,
    Omit<React.ComponentPropsWithoutRef<"div">, "value" | "onChange"> {
  /** Color from theme.colors */
  color?: MantineColor;

  /** Track border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Predefined track and thumb size, number to set sizes in px */
  size?: MantineNumberSize;

  /** Minimal possible value */
  min?: number;

  /** Maximum possible value */
  max?: number;

  /** Number by which value will be incremented/decremented with thumb drag and arrows */
  step?: number;

  /** Amount of digits after the decimal point */
  precision?: number;

  /** Current value for controlled slider */
  value?: number;

  /** Default value for uncontrolled slider */
  defaultValue?: number;

  /** Called each time value changes */
  onChange?(value: number): void;

  /** Called when user stops dragging slider or changes value with arrows */
  onChangeEnd?(value: number): void;

  /** Hidden input name, use with uncontrolled variant */
  name?: string;

  /** Marks which will be placed on the track */
  marks?: { value: number; label?: React.ReactNode }[];

  /** Function to generate label or any react node to render instead, set to null to disable label */
  label?: React.ReactNode | ((value: number) => React.ReactNode);

  /** If true label will be not be hidden when user stops dragging */
  labelAlwaysOn?: boolean;

  /** Thumb aria-label */
  thumbLabel?: string;

  /** If true slider label will appear on hover */
  showLabelOnHover?: boolean;

  /** Thumb children, can be used to add icon */
  thumbChildren?: React.ReactNode;

  /** Disables slider */
  disabled?: boolean;

  /** Thumb width and height in px */
  thumbSize?: number;

  /** A transformation function, to change the scale of the slider */
  scale?: (value: number) => number;
}

const defaultProps: Partial<SliderProps> = {
  size: "md",
  radius: "xl",
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (f) => f,
  labelAlwaysOn: false,
  thumbLabel: "",
  showLabelOnHover: true,
  disabled: false,
  scale: (v) => v,
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const {
    classNames,
    styles,
    color,
    value,
    onChange,
    onChangeEnd,
    size,
    radius,
    min,
    max,
    step,
    precision,
    defaultValue,
    name,
    marks,
    label,
    labelAlwaysOn,
    thumbLabel,
    showLabelOnHover,
    thumbChildren,
    disabled = false,
    unstyled,
    thumbSize,
    scale,
    ...others
  } = useComponentDefaultProps("Slider", defaultProps, props);

  const theme = useMantineTheme();
  const [hovered, setHovered] = useState(false);
  const [_value, setValue] = useUncontrolled({
    value: typeof value === "number" ? clamp(value, min, max) : value,
    defaultValue: typeof defaultValue === "number" ? clamp(defaultValue, min, max) : defaultValue,
    finalValue: clamp(0, min, max),
    onChange,
  });

  const valueRef = useRef(_value);
  const thumb = useRef<HTMLDivElement>();
  const position = getPosition({ value: _value, min, max });
  const scaledValue = scale(_value);
  const _label = typeof label === "function" ? label(scaledValue) : label;

  const handleChange = useCallback(
    ({ x }: { x: number }) => {
      if (!disabled) {
        const nextValue = getChangeValue({ value: x, min, max, step, precision });
        setValue(nextValue);
        valueRef.current = nextValue;
      }
    },
    [disabled, min, max, step, precision]
  );

  const { ref: container, active } = useMove(
    handleChange,
    { onScrubEnd: () => onChangeEnd?.(valueRef.current) },
    theme.dir
  );

  const handleThumbMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  const { classes, cx } = useStyles(
    { size, disabled },
    { classNames, styles, unstyled, name: "Slider" }
  );

  return (
    <div
      tabIndex={-1}
      className={cx(classes.sliderRoot, classNames)}
      ref={useMergedRef(container, ref)}
      onMouseDownCapture={() => container.current?.focus()}
    >
      <Track
        offset={0}
        filled={position}
        marks={marks}
        size={size}
        radius={radius}
        color={color}
        min={min}
        max={max}
        value={scaledValue}
        onChange={setValue}
        onMouseEnter={showLabelOnHover ? () => setHovered(true) : undefined}
        onMouseLeave={showLabelOnHover ? () => setHovered(false) : undefined}
        classNames={classNames}
        styles={styles}
        disabled={disabled}
        unstyled={unstyled}
      >
        <Thumb
          max={max}
          min={min}
          value={scaledValue}
          position={position}
          dragging={active}
          color={color}
          size={size}
          label={_label}
          ref={thumb}
          onMouseDown={handleThumbMouseDown}
          labelAlwaysOn={labelAlwaysOn}
          classNames={classNames}
          styles={styles}
          thumbLabel={thumbLabel}
          showLabelOnHover={showLabelOnHover && hovered}
          disabled={disabled}
          unstyled={unstyled}
          thumbSize={thumbSize}
        >
          {thumbChildren}
        </Thumb>
      </Track>

      <input type="hidden" name={name} value={scaledValue} />
    </div>
  );
});
