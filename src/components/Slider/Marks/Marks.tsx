import React from "react";
import { getPosition } from "../utils/get-position";
import { isMarkFilled } from "../utils/is-mark-filled";

import classNames from "classnames";
import styles from "./Marks.module.scss";
import { NumberSize, calcSize, sizes } from "../utils";

export interface MarksProps {
	marks: { value: number; label?: React.ReactNode }[];
	size: NumberSize;
	min: number;
	max: number;
	value: number;
	onChange(value: number): void;
	offset?: number;
	disabled: boolean;
}

export function Marks({
	marks,
	size,
	min,
	max,
	value,
	offset,
	onChange,
}: MarksProps) {
	const items = marks.map((mark, index) => (
		<div
			className={classNames(styles.markWrapper, styles[`fonts--${size}`])}
			style={{ left: `${getPosition({ value: mark.value, min, max })}%` }}
			key={index}
		>
			<div
				className={classNames(
					styles.mark,
					styles.markFilled && isMarkFilled({ mark, value, offset })
				)}
				style={{
					transform: `translateX(-${
						calcSize({ sizes, size }) / 4
					}px)`,
				}}
			/>
			{mark.label && (
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions
				<div
					className={styles.markLabel}
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
