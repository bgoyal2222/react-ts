import React, { cloneElement, forwardRef, useRef } from "react";
import { isElement } from "../../hooks";
import { useMergedRef } from "../../hooks";
import { TooltipFloating } from "./TooltipFloating/TooltipFloating";
import { useTooltip } from "./use-tooltip";
import {
	FloatingArrow,
	getFloatingPosition,
	FloatingPosition,
	ArrowPosition,
} from "../Floating";
import { TOOLTIP_ERRORS } from "./Tooltip.errors";
import { TooltipBaseProps } from "./Tooltip.types";
import styles from "./Tooltip.module.scss";
import { ForwardRefWithStaticComponents } from "./utils/ForwardRefWithStaticComponents";
import { useComponentDefaultProps } from "../Slider/utils";
import classNames from "classnames";

export interface TooltipProps extends TooltipBaseProps {
	variant?: string;

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

	/** Arrow radius */
	arrowRadius?: number;

	/** Arrow position **/
	arrowPosition?: ArrowPosition;

	/** Determines which events will be used to show tooltip */
	events?: { hover: boolean; focus: boolean; touch: boolean };

	/** useEffect dependencies to force update tooltip position */
	positionDependencies?: any[];

	/** Set if tooltip is attached to an inline element */
	inline?: boolean;

	/** If set tooltip will not be unmounted from the DOM when it is hidden, display: none styles will be added instead */
	keepMounted?: boolean;
}

const defaultProps: Partial<TooltipProps> = {
	position: "top",
	refProp: "ref",
	inline: false,
	arrowSize: 4,
	arrowOffset: 5,
	arrowRadius: 0,
	arrowPosition: "side",
	offset: 5,
	width: "auto",
	events: { hover: true, focus: false, touch: false },
	zIndex: 100,
	positionDependencies: [],
};

const _Tooltip = forwardRef<HTMLElement, TooltipProps>((props, ref) => {
	const arrowRef = useRef<HTMLDivElement | null>(null);
	const {
		children,
		position,
		refProp,
		label,
		openDelay,
		closeDelay,
		onPositionChange,
		opened,
		radius,
		color,
		style,
		className,
		withArrow,
		arrowSize,
		arrowOffset,
		arrowRadius,
		arrowPosition,
		offset,
		multiline,
		width,
		events,
		zIndex,
		disabled,
		positionDependencies,
		onClick,
		onMouseEnter,
		onMouseLeave,
		inline,
		variant,
		keepMounted,
		...others
	} = useComponentDefaultProps(defaultProps, props);

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
		inline,
	});

	if (!isElement(children)) {
		console.error(ref);
		// throw new Error(TOOLTIP_ERRORS.children);
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
					arrowRadius={arrowRadius}
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
					// className={classNames(
					//     styles.sliderRoot,
					//     disabled && styles.disabled
					// )}
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
