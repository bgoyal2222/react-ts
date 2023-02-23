import React from "react";
import { DefaultProps, MantineNumberSize, MantineColor, Selectors } from "@mantine/styles";
import { Marks, MarksStylesNames } from "../Marks/Marks";
import { sizes } from "../Slider/Slider.styles";
import useStyles from "./Track.styles";

export type TrackStylesNames = Selectors<typeof useStyles> | MarksStylesNames;

export interface TrackProps extends DefaultProps<TrackStylesNames> {
  filled: number;
  offset?: number;
  marksOffset?: number;
  marks: { value: number; label?: React.ReactNode }[];
  size: MantineNumberSize;
  radius: MantineNumberSize;
  color: MantineColor;
  min: number;
  max: number;
  value: number;
  children: React.ReactNode;
  onChange(value: number): void;
  onMouseEnter?(event?: React.MouseEvent<HTMLDivElement>): void;
  onMouseLeave?(event?: React.MouseEvent<HTMLDivElement>): void;
  disabled: boolean;
}

export function Track({
  size,
  filled,
  color,
  classNames,
  styles,
  radius,
  children,
  offset,
  onMouseLeave,
  onMouseEnter,
  disabled,
  marksOffset,
  unstyled,
  ...others
}: TrackProps) {
  const { classes } = useStyles(
    { color, size, radius, disabled },
    { classNames, styles, unstyled, name: "Slider" }
  );

  return (
    <div className={classes.track} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      <div
        className={classes.bar}
        style={{
          left: `calc(${offset}% - ${sizes[size]}px)`,
          width: `calc(${filled}% + ${sizes[size]}px)`,
        }}
      />
      {children}
      <Marks
        {...others}
        size={size}
        color={color}
        offset={marksOffset}
        classNames={classNames}
        styles={styles}
        disabled={disabled}
        unstyled={unstyled}
      />
    </div>
  );
}
