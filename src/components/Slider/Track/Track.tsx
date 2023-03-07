import React from "react";
import { Marks } from "../Marks/Marks";

import classNames from "classnames";
import styles from "./Track.module.scss";
import { DefaultProps, NumberSize, calcSize, sizes } from "../utils";

export interface TrackProps extends DefaultProps {
	filled: number;
	offset?: number;
	marksOffset?: number;
	marks: { value: number; label?: React.ReactNode }[];
	size: NumberSize;
	color: string;
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
	children,
	offset,
	onMouseLeave,
	onMouseEnter,
	disabled,
	marksOffset,
	unstyled,
	...others
}: TrackProps) {
	return (
		<div
			className={classNames(
				styles.track,
				!disabled && styles[`track--${color}`],
				disabled && styles[`disabled--${color}`]
			)}
			onMouseLeave={onMouseLeave}
			onMouseEnter={onMouseEnter}
			style={{
				marginRight: calcSize({ size, sizes }),
				marginLeft: calcSize({ size, sizes }),
				height: `${calcSize({ size, sizes }) / 1.5}px`,
			}}
		>
			<div
				className={classNames(
					styles.bar,
					!disabled && styles[`bar--${color}`]
				)}
				style={{
					left: `calc(${offset}% - ${calcSize({ size, sizes })}px)`,
					width: `calc(${filled}% + ${calcSize({ size, sizes })}px)`,
				}}
			/>
			{children}
			<Marks
				{...others}
				size={size}
				offset={marksOffset}
				disabled={disabled}
			/>
		</div>
	);
}
