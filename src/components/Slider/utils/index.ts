type FilterPropsRes<T extends Record<string, any>> = {
	[Key in keyof T]-?: T[Key] extends undefined ? never : T[Key];
};

export function filterProps<T extends Record<string, any>>(props: T) {
	return Object.keys(props).reduce<FilterPropsRes<T>>((acc, key: keyof T) => {
		if (props[key] !== undefined) {
			acc[key] = props[key];
		}
		return acc;
	}, {} as FilterPropsRes<T>);
}

export function useComponentDefaultProps<
	T extends Record<string, any>,
	U extends Partial<T> = {}
>(
	defaultProps: U,
	props: T
): T & {
	[Key in Extract<keyof T, keyof U>]-?: U[Key] | NonNullable<T[Key]>;
} {
	return { ...defaultProps, ...filterProps(props) };
}

export const sizes = {
	xs: 4,
	s: 6,
	m: 8,
	l: 10,
	xl: 12,
};

interface GetSize {
	size: string | number;
	sizes: Record<string, any>;
}

export function calcSize(props: GetSize) {
	if (typeof props.size === "number") {
		return props.size;
	}

	const computedSize = props.sizes[props.size];

	return computedSize !== undefined
		? computedSize
		: props.size || props.sizes.m;
}

import { CSSProperties } from "react";

export type ClassNames<StylesNames extends string> = Partial<
	Record<StylesNames, string>
>;

export interface DefaultProps<StylesNames extends string = never> {
	className?: string;
	style?: CSSProperties;
	classNames?: ClassNames<StylesNames>;
	unstyled?: boolean;
}

export type NumberSize = "xs" | "s" | "m" | "l" | "xl";
