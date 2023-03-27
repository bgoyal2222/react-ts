import React, { cloneElement } from "react";
import { useMergedRef } from "../../../hooks";
import { TooltipBaseProps } from "../utils/Tooltip.types";
import { TOOLTIP_ERRORS } from "../utils/Tooltip.errors";
import { useFloatingTooltip } from "./use-floating-tooltip";
import { isElement } from "../../../hooks/utils/isElement";
import { useComponentDefaultProps } from "../../Slider/utils";
import styles from "./Tooltip.module.scss";
import classNames from "classnames";

export interface TooltipFloatingProps extends TooltipBaseProps {
	variant?: string;

	/** Offset from mouse */
	offset?: number;
}

export function TooltipFloating(props: TooltipFloatingProps) {
	const {
		children,
		refProp = "ref",
		style,
		className,
		radius,
		color,
		label,
		offset = 10,
		position = "right",
		multiline,
		width,
		zIndex = 100,
		disabled,
		variant,
		...others
	} = useComponentDefaultProps({}, props);

	const { handleMouseMove, x, y, opened, boundaryRef, floating, setOpened } =
		useFloatingTooltip({
			offset,
			position,
		});

	if (!isElement(children)) {
		throw new Error(TOOLTIP_ERRORS.children);
	}

	const targetRef = useMergedRef(boundaryRef, (children as any).ref);

	const onMouseEnter = (event: React.MouseEvent<unknown, MouseEvent>) => {
		children.props.onMouseEnter?.(event);
		handleMouseMove(event);
		setOpened(true);
	};

	const onMouseLeave = (event: React.MouseEvent<unknown, MouseEvent>) => {
		children.props.onMouseLeave?.(event);
		setOpened(false);
	};

	return (
		<>
			<div
				{...others}
				ref={floating}
				className={classNames(styles.tooltip)}
				style={{
					...style,
					zIndex,
					display: !disabled && opened ? "block" : "none",
					top: y ?? "",
					left: Math.round(x || 0) ?? "",
				}}
			>
				{label}
			</div>

			{cloneElement(children, {
				...children.props,
				[refProp]: targetRef,
				onMouseEnter,
				onMouseLeave,
			})}
		</>
	);
}
