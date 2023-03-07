import classNames from "classnames";
import { forwardRef } from "react";

import styles from "./ButtonV2.module.scss";

export type ButtonVariant = "default" | "primary" | "secondary" | "tertiary" | "danger";

export type ButtonSize = "normal" | "small" | "extra-small";
export interface ButtonV2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  isSquare?: boolean;
}
const ButtonV2 = forwardRef<HTMLButtonElement, ButtonV2Props>(
  ({ variant = "default", className, size = "normal", isSquare = false, ...props }, ref) => (
    <button
      type="button"
      ref={ref}
      className={classNames(
        styles.button,
        size === "small" && styles.small,
        size === "extra-small" && styles.extraSmall,
        styles[`button--${variant}`],
        isSquare && styles.noText,
        className
      )}
      {...props}
    >
      {props.children}
    </button>
  )
);

export default ButtonV2;
