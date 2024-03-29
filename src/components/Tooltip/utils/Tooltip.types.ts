import { FloatingPosition } from "../Floating";

export interface TooltipBaseProps
	extends React.ComponentPropsWithoutRef<"div"> {
	/** Target element */
	children: React.ReactNode;

	/** Tooltip position relative to target element (default) or mouse (floating) */
	position?: FloatingPosition;

	/** Key of the prop that should be used to get element ref */
	refProp?: string;

	/** Tooltip label */
	label: React.ReactNode;

	/** Key of theme.radius or any valid CSS value to set border-radius, theme.defaultRadius by default */
	radius?: number;

	/** Key of theme.colors */
	color?: string;

	/** Defines whether content should be wrapped on to the next line */
	multiline?: boolean;

	/** Tooltip width */
	width?: number | "auto";

	/** Tooltip z-index */
	zIndex?: React.CSSProperties["zIndex"];

	/** Disables tooltip */
	disabled?: boolean;
}
