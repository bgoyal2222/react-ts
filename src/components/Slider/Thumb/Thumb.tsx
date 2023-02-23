import React, { useState, forwardRef } from "react";
import { DefaultProps, MantineNumberSize, MantineColor, Selectors } from "@mantine/styles";
import useStyles from "./Thumb.styles";

export type ThumbStylesNames = Selectors<typeof useStyles>;

export interface ThumbProps extends DefaultProps<ThumbStylesNames> {
  max: number;
  min: number;
  value: number;
  position: number;
  dragging: boolean;
  color: MantineColor;
  size: MantineNumberSize;
  label: React.ReactNode;
  onMouseDown(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void;
  labelAlwaysOn: boolean;
  thumbLabel: string;
  onFocus?(): void;
  onBlur?(): void;
  showLabelOnHover?: boolean;
  children?: React.ReactNode;
  disabled: boolean;
  thumbSize: number;
}

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
  (
    {
      max,
      min,
      value,
      position,
      label,
      dragging,
      onMouseDown,
      color,
      classNames,
      styles,
      size,
      labelAlwaysOn,
      thumbLabel,
      onFocus,
      onBlur,
      showLabelOnHover,
      children = null,
      disabled,
      unstyled,
      thumbSize,
    }: ThumbProps,
    ref
  ) => {
    const { classes, cx, theme } = useStyles(
      { color, size, disabled, thumbSize },
      { classNames, styles, unstyled, name: "Slider" }
    );
    const [focused, setFocused] = useState(false);
    const isVisible = labelAlwaysOn || dragging || focused || showLabelOnHover;

    return (
      <div
        tabIndex={0}
        role="slider"
        aria-label={thumbLabel}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        ref={ref}
        className={cx(classes.thumb, { [classes.dragging]: dragging })}
        onFocus={() => {
          setFocused(true);
          typeof onFocus === "function" && onFocus();
        }}
        onBlur={() => {
          setFocused(false);
          typeof onBlur === "function" && onBlur();
        }}
        onTouchStart={onMouseDown}
        onMouseDown={onMouseDown}
        onClick={(event) => event.stopPropagation()}
        style={{ [theme.dir === "rtl" ? "right" : "left"]: `${position}%` }}
      >
        {children}
        <div
          style={{
            display: isVisible ? "block" : "none",
          }}
          className={classes.label}
        >
          {label}
        </div>
      </div>
    );
  }
);
