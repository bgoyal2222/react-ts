import React, { forwardRef, useRef, useState, useCallback } from "react";
import { useMove, clamp, useUncontrolled, useMergedRef } from "../../../hooks";

import { getPosition } from "../utils/get-position";
import { getChangeValue } from "../utils/get-change-value";
import { Thumb } from "../Thumb/Thumb";
import { Track } from "../Track/Track";

import classNames from "classnames";
import styles from "./Slider.module.scss";
import { DefaultProps, NumberSize, useComponentDefaultProps } from "../utils";

export interface SliderProps
	extends DefaultProps,
		Omit<React.ComponentPropsWithoutRef<"div">, "value" | "onChange"> {
	/** Colors */
	variant?: "red" | "purple";

	/** Predefined track and thumb size, number to set sizes in px */
	size?: NumberSize;

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
	variant: "red",
	size: "m",
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
		variant,
		value,
		onChange,
		onChangeEnd,
		size,
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
		thumbSize,
		scale,
		...others
	} = useComponentDefaultProps(defaultProps, props);

	const [hovered, setHovered] = useState(false);
	const [_value, setValue] = useUncontrolled({
		value: typeof value === "number" ? clamp(value, min, max) : value,
		defaultValue:
			typeof defaultValue === "number" ? clamp(defaultValue, min, max) : defaultValue,
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

	const { ref: container, active } = useMove(handleChange, {
		onScrubEnd: () => onChangeEnd?.(valueRef.current),
	});

	const handleThumbMouseDown = (
		event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		event.stopPropagation();
	};

	const handleTrackKeydownCapture = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (!disabled) {
				switch (event.key) {
					case "ArrowUp": {
						event.preventDefault();
						thumb.current.focus();
						const nextValue = Math.min(
							Math.max(_value + step, min),
							max
						);
						onChangeEnd?.(nextValue);
						setValue(nextValue);
						break;
					}

					case "ArrowRight": {
						event.preventDefault();
						thumb.current.focus();
						const nextValue = Math.min(
							Math.max(_value + step, min),
							max
						);
						onChangeEnd?.(nextValue);
						setValue(nextValue);
						break;
					}

					case "ArrowDown": {
						event.preventDefault();
						thumb.current.focus();
						const nextValue = Math.min(
							Math.max(_value - step, min),
							max
						);
						onChangeEnd?.(nextValue);
						setValue(nextValue);
						break;
					}

					case "ArrowLeft": {
						event.preventDefault();
						thumb.current.focus();
						const nextValue = Math.min(
							Math.max(_value - step, min),
							max
						);
						onChangeEnd?.(nextValue);
						setValue(nextValue);
						break;
					}

					case "Home": {
						event.preventDefault();
						thumb.current.focus();
						onChangeEnd?.(min);
						setValue(min);
						break;
					}

					case "End": {
						event.preventDefault();
						thumb.current.focus();
						onChangeEnd?.(max);
						setValue(max);
						break;
					}

					default: {
						break;
					}
				}
			}
		},
		[_value, disabled, min, max, step]
	);

	return (
		<div
			tabIndex={-1}
			ref={useMergedRef(container, ref)}
			onMouseDownCapture={() => container.current?.focus()}
			onKeyDownCapture={handleTrackKeydownCapture}
			className={classNames(
				styles.sliderRoot,
				disabled && styles.disabled
			)}
			{...others}
		>
			<Track
				offset={0}
				filled={position}
				marks={marks}
				size={size}
				color={variant}
				min={min}
				max={max}
				value={scaledValue}
				onChange={setValue}
				onMouseEnter={
					showLabelOnHover ? () => setHovered(true) : undefined
				}
				onMouseLeave={
					showLabelOnHover ? () => setHovered(false) : undefined
				}
				disabled={disabled}
			>
				<Thumb
					max={max}
					min={min}
					value={scaledValue}
					position={position}
					dragging={active}
					color={variant}
					size={size}
					label={_label}
					ref={thumb}
					onMouseDown={handleThumbMouseDown}
					labelAlwaysOn={labelAlwaysOn}
					thumbLabel={thumbLabel}
					showLabelOnHover={showLabelOnHover && hovered}
					disabled={disabled}
					thumbSize={thumbSize}
				>
					{thumbChildren}
				</Thumb>
			</Track>

			<input type='hidden' name={name} value={scaledValue} />
		</div>
	);
});
