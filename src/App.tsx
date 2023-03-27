import { forwardRef, useEffect, useState } from "react";
import "./App.css";
import { Slider } from "./components/Slider";
import { Tooltip } from "./components/Tooltip";

const MyBadge = forwardRef<HTMLDivElement, { color: string; other: any }>(
	({ color, ...other }, ref) => (
		<div
			ref={ref}
			color={color}
			{...other}
			tabIndex={0}
			style={{
				padding: "1rem",
				backgroundColor: "black",
				borderRadius: "0.5rem",
				color: "white",
				width: "20rem",
				boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			Badge
		</div>
	)
);

const App = () => {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			style={{
				marginTop: "20rem",
			}}
		>
			<div
				style={{
					// display: "none",
					margin: "6rem",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						fontFamily: "sans-serif",
						fontSize: "1.5rem",
					}}
				>
					<h2>Slider Component 1</h2>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10rem",
						margin: "6rem",
					}}
				>
					<Slider
						disabled
						defaultValue={50}
						showLabelOnHover={true}
						marks={[
							{ value: 0, label: "$0" },
							{ value: 20, label: "$20" },
							{ value: 40, label: "$40" },
							{ value: 60, label: "$60" },
						]}
						disabledPercentage={50}
					/>
					<Slider
						label={(value) => `${value}%`}
						labelAlwaysOn
						variant='red'
						showLabelOnHover={true}
						defaultValue={50}
						marks={[
							{ value: 0, label: "$0" },
							{ value: 20, label: "$20" },
							{ value: 40, label: "$40" },
							{ value: 60, label: "$60" },
							{ value: 80, label: "$80" },
							{ value: 100, label: "$100" },
						]}
						disabledPercentage={20}
					/>
					<Slider
						size='l'
						variant='purple'
						showLabelOnHover={true}
						marks={[
							{ value: 0, label: "$0" },
							{ value: 20, label: "$20" },
							{ value: 40, label: "$40" },
							{ value: 60, label: "$60" },
							{ value: 80, label: "$80" },
							{ value: 100, label: "$100" },
						]}
					/>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "sans-serif",
					fontSize: "1.5rem",
					display: "none",
				}}
			>
				<Tooltip
					opened={hovered}
					events={{
						touch: true,
						focus: true,
						hover: true,
					}}
					withArrow
					arrowSize={20}
					position='left'
					label={
						<div
							onMouseLeave={() => setHovered(false)}
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1rem",
								padding: "1rem",
								backgroundColor: "white",
								borderRadius: "0.5rem",
								color: "black",
								width: "20rem",
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							}}
						>
							<h2>Tooltip Heading</h2>
							<div>
								Instant payout is activated. $3,450.80 in
								transit payout from your Shopify store was
								automatically deposited.
							</div>
							<button>Button</button>
						</div>
					}
				>
					<MyBadge
						onMouseEnter={() => {
							setHovered(true);
						}}
						color={"red"}
					/>
				</Tooltip>
			</div>
		</div>
	);
};

export default App;
