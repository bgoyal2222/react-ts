import React from "react";
import { DefaultProps, MantineNumberSize, MantineColor, Selectors } from "@mantine/styles";
import { getPosition } from "../utils/get-position/get-position";
import { isMarkFilled } from "./is-mark-filled";
import useStyles from "./Marks.styles";

export type MarksStylesNames = Selectors<typeof useStyles>;

export interface MarksProps extends DefaultProps<MarksStylesNames> {
  marks: { value: number; label?: React.ReactNode }[];
  size: MantineNumberSize;
  color: MantineColor;
  min: number;
  max: number;
  value: number;
  onChange(value: number): void;
  offset?: number;
  disabled: boolean;
}

export function Marks({
  marks,
  color,
  size,
  min,
  max,
  value,
  classNames,
  styles,
  offset,
  onChange,
  disabled,
  unstyled,
}: MarksProps) {
  const { classes, cx } = useStyles(
    { size, color, disabled },
    { classNames, styles, unstyled, name: "Slider" }
  );

  const items = marks.map((mark, index) => (
    <div
      className={classes.markWrapper}
      style={{ left: `${getPosition({ value: mark.value, min, max })}%` }}
      key={index}
    >
      <div
        className={cx(classes.mark, {
          [classes.markFilled]: isMarkFilled({ mark, value, offset }),
        })}
      />
      {mark.label && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={classes.markLabel}
          onMouseDown={(event) => {
            event.stopPropagation();
            onChange(mark.value);
          }}
          onTouchStart={(event) => {
            event.stopPropagation();
            onChange(mark.value);
          }}
        >
          {mark.label}
        </div>
      )}
    </div>
  ));

  return <div>{items}</div>;
}
