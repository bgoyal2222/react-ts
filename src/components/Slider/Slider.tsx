import React, { forwardRef, useRef, useState, useCallback } from "react";
import { useMove, clamp, useUncontrolled, useMergedRef } from "../../hooks";

import { getPosition } from "./utils/get-position";
import { getChangeValue } from "./utils/get-change-value";
import { Thumb } from "./Thumb/Thumb";
import { Track } from "./Track/Track";

import classNames from "classnames";
import styles from "./Slider.module.scss";
import { DefaultProps, NumberSize, useComponentDefaultProps } from "./utils";

export interface SliderProps
	extends DefaultProps,
		Omit<React.ComponentPropsWithoutRef<"div">, "value" | "onChange"> {
	/** Colors */
	variant?: "red" | "purple";

	/** Predefined track and thumb size, number to set sizes in px */
	size?: NumberSize;

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

	/** Marks which will be placed on the track */
	marks?: { value: number; label?: React.ReactNode }[];

	/** Function to generate label or any react node to render instead, set to null to disable label */
	label?: React.ReactNode | ((value: number) => React.ReactNode);

	/** If true label will be not be hidden when user stops dragging */
	labelAlwaysOn?: boolean;

	/** If true slider label will appear on hover */
	showLabelOnHover?: boolean;

	/** Thumb children, can be used to add icon */
	thumbChildren?: React.ReactNode;

	/** Disables slider */
	disabled?: boolean;
	// show values in disabled

	/** Thumb width and height in px */
	thumbSize?: number;

	disabledPercentage?: number;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
	const {
		variant = "red",
		value,
		onChange,
		onChangeEnd,
		size = "m",
		step = 1,
		precision,
		defaultValue,
		marks = [],
		label = (f: any) => f,
		labelAlwaysOn = false,
		showLabelOnHover = true,
		thumbChildren,
		disabled = false,
		thumbSize,
		disabledPercentage = 0,
		...others
	} = useComponentDefaultProps({}, props);

	const min = 0,
		max = 100;
	const [hovered, setHovered] = useState(false);
	const [_value, setValue] = useUncontrolled({
		value: typeof value === "number" ? clamp(value, min, max) : value,
		defaultValue:
			typeof defaultValue === "number"
				? clamp(
						defaultValue,
						min,
						Number(
							disabledPercentage !== 0 ? disabledPercentage : max
						)
				  )
				: defaultValue,
		finalValue: clamp(0, min, max),
		onChange,
	});

	const valueRef = useRef(_value);
	const thumb = useRef<HTMLDivElement | null>(null);
	const position = getPosition({ value: _value, min, max });
	const scaledValue = _value;
	const _label = typeof label === "function" ? label(scaledValue) : label;

	const handleChange = useCallback(
		({ x }: { x: number }) => {
			if (!disabled) {
				const nextValue = getChangeValue({
					value: x,
					min,
					max,
					step,
					precision,
				});

				if (
					nextValue <=
					Number(disabledPercentage !== 0 ? disabledPercentage : max)
				) {
					setValue(nextValue);
				}

				valueRef.current = nextValue;
			}
		},
		[disabled, min, max, step, precision, disabledPercentage]
	);

	const { ref: container, active } = useMove(handleChange, {
		onScrubEnd: () => onChangeEnd?.(valueRef.current),
	});

	const handleThumbMouseDown = (
		event:
			| React.MouseEvent<HTMLDivElement>
			| React.TouchEvent<HTMLDivElement>
	) => {
		event.stopPropagation();
	};

	const keyHandleChange = (
		event: React.KeyboardEvent<HTMLDivElement>,
		value: number
	) => {
		event.preventDefault();
		thumb.current?.focus();
		onChangeEnd?.(value);
		setValue(value);
	};

	const handleTrackKeydownCapture = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (!disabled) {
				switch (event.key) {
					case "ArrowUp": {
						const nextValue = Math.min(
							Math.max(_value + step, min),
							max
						);
						keyHandleChange(event, nextValue);
						break;
					}

					case "ArrowRight": {
						const nextValue = Math.min(
							Math.max(_value + step, min),
							max
						);
						keyHandleChange(event, nextValue);
						break;
					}

					case "ArrowDown": {
						const nextValue = Math.min(
							Math.max(_value - step, min),
							max
						);
						keyHandleChange(event, nextValue);
						break;
					}

					case "ArrowLeft": {
						const nextValue = Math.min(
							Math.max(_value - step, min),
							max
						);
						keyHandleChange(event, nextValue);
						break;
					}

					case "Home": {
						keyHandleChange(event, min);
						break;
					}

					case "End": {
						keyHandleChange(event, max);
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
			onMouseDownCapture={() => container.current?.focus()}
			onKeyDownCapture={handleTrackKeydownCapture}
			className={classNames(
				styles.sliderRoot,
				disabled && styles.disabled
			)}
			{...others}
		>
			<Track
				// @ts-ignore
				ref={useMergedRef(container, ref)}
				className={classNames(disabled && styles.disabled)}
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
				style={{
					width: `${100}%`,
				}}
				disabledPercentage={disabledPercentage}
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
					thumbLabel={"Slider Seek"}
					showLabelOnHover={showLabelOnHover && hovered}
					disabled={disabled}
					thumbSize={thumbSize}
				>
					{thumbChildren}
				</Thumb>
			</Track>
			<input type='hidden' name={"Slider"} value={scaledValue} />
		</div>
	);
});
