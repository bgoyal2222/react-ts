import React, { cloneElement, forwardRef, useRef } from "react";
import { isElement } from "../../hooks";
import { useMergedRef } from "../../hooks";
import { TooltipFloating } from "./TooltipFloating/TooltipFloating";
import { useTooltip } from "./utils/use-tooltip";
import {
	FloatingArrow,
	getFloatingPosition,
	FloatingPosition,
	ArrowPosition,
} from "./Floating";
import { TOOLTIP_ERRORS } from "./utils/Tooltip.errors";
import { TooltipBaseProps } from "./utils/Tooltip.types";
import { ForwardRefWithStaticComponents } from "./utils/ForwardRefWithStaticComponents";
import { useComponentDefaultProps } from "../Slider/utils";
import classNames from "classnames";
import styles from "./Tooltip.module.scss";

export interface TooltipProps extends TooltipBaseProps {
	/** Called when tooltip position changes */
	onPositionChange?(position: FloatingPosition): void;

	/** Open delay in ms */
	openDelay?: number;

	/** Close delay in ms */
	closeDelay?: number;

	/** Controls opened state */
	opened?: boolean;

	/** Space between target element and tooltip */
	offset?: number;

	/** Determines whether component should have an arrow */
	withArrow?: boolean;

	/** Arrow size */
	arrowSize?: number;

	/** Arrow offset */
	arrowOffset?: number;

	/** Arrow position **/
	arrowPosition?: ArrowPosition;

	/** Determines which events will be used to show tooltip */
	events?: { hover: boolean; focus: boolean; touch: boolean };

	/** useEffect dependencies to force update tooltip position */
	positionDependencies?: any[];

}

const _Tooltip = forwardRef<HTMLElement, TooltipProps>((props, ref) => {
	const arrowRef = useRef<HTMLDivElement | null>(null);
	const {
		children,
		position = "top",
		refProp = "ref",
		label,
		openDelay = 0,
		closeDelay = 0,
		onPositionChange,
		opened,
		radius,
		color,
		style,
		className,
		withArrow,
		arrowSize = 4,
		arrowOffset = 5,
		arrowPosition = "side",
		offset = 5,
		multiline,
		width = "auto",
		events = { hover: true, focus: false, touch: false },
		zIndex = 100,
		disabled,
		positionDependencies = [],
		onClick,
		onMouseEnter,
		onMouseLeave,
		...others
	} = useComponentDefaultProps({}, props);

	const tooltip = useTooltip({
		position: getFloatingPosition("ltr", position),
		closeDelay,
		openDelay,
		onPositionChange,
		opened,
		events,
		arrowRef,
		arrowOffset,
		offset: offset + (withArrow ? arrowSize / 2 : 0),
		positionDependencies: [...positionDependencies, children],
		inline: false,
	});

	if (!isElement(children)) {
		throw new Error(TOOLTIP_ERRORS.children);
	}

	const targetRef = useMergedRef(
		tooltip.reference,
		(children as any).ref,
		ref
	);

	return (
		<>
			<div
				{...others}
				{...tooltip.getFloatingProps({
					ref: tooltip.floating,
					className: classNames(styles.tooltip),
					style: {
						...style,
						zIndex,
						top: tooltip.y ?? 0,
						left: tooltip.x ?? 0,
						display: tooltip.opened ? "block" : "none",
					},
				})}
			>
				{label}
				<FloatingArrow
					ref={arrowRef}
					arrowX={tooltip.arrowX}
					arrowY={tooltip.arrowY}
					visible={withArrow}
					position={tooltip.placement}
					arrowSize={arrowSize}
					arrowOffset={arrowOffset}
					arrowRadius={0}
					arrowPosition={arrowPosition}
					className={classNames(styles.arrow)}
				/>
			</div>
			{cloneElement(
				children,
				tooltip.getReferenceProps({
					onClick,
					onMouseEnter,
					onMouseLeave,
					onMouseMove: props.onMouseMove,
					onPointerDown: props.onPointerDown,
					onPointerEnter: props.onPointerEnter,
					[refProp]: targetRef,
					...children.props,
				})
			)}
		</>
	);
}) as any;

export const Tooltip: ForwardRefWithStaticComponents<
	TooltipProps,
	{ Floating: typeof TooltipFloating }
> = _Tooltip;
