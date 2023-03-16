import React, { useState, forwardRef } from "react";
import classNames from "classnames";
import styles from "./Thumb.module.scss";
import { NumberSize, calcSize, sizes } from "../utils";

export interface ThumbProps {
	max: number;
	min: number;
	value: number;
	position: number;
	dragging: boolean;
	color: string;
	size: NumberSize;
	label: React.ReactNode;
	onMouseDown(
		event:
			| React.MouseEvent<HTMLDivElement>
			| React.TouchEvent<HTMLDivElement>
	): void;
	labelAlwaysOn: boolean;
	thumbLabel: string;
	onFocus?(): void;
	onBlur?(): void;
	showLabelOnHover?: boolean;
	children?: React.ReactNode;
	disabled: boolean;
	thumbSize: number | undefined;
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
			size,
			labelAlwaysOn,
			thumbLabel,
			onFocus,
			onBlur,
			showLabelOnHover,
			children = null,
			disabled,
			thumbSize,
		}: ThumbProps,
		ref
	) => {
		const [focused, setFocused] = useState(false);
		const isVisible =
			labelAlwaysOn || dragging || focused || showLabelOnHover;

		return (
			<div
				tabIndex={0}
				role='slider'
				className={classNames(
					styles.thumb,
					dragging && styles.dragging,
					disabled && styles.disabled,
					styles[`thumb--${color}`],
					styles[`fonts--${size}`]
				)}
				aria-label={thumbLabel}
				aria-valuemax={max}
				aria-valuemin={min}
				aria-valuenow={value}
				ref={ref}
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
				style={{
					left: `${position}%`,
					height: thumbSize || calcSize({ sizes, size }) * 4,
					width: thumbSize || calcSize({ sizes, size }) * 4,
				}}
			>
				{children}
				<div
					style={{
						display: isVisible ? "block" : "none",
					}}
					className={classNames(styles.label)}
				>
					{label}
				</div>
			</div>
		);
	}
);
