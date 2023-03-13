import "./App.css";
import { Slider } from "./components/Slider";

const App = () => (
	<div>
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
				showLabelOnHover={true}
				min={0}
				max={50}
				marks={[
					{ value: 0, label: "$0" },
					{ value: 20, label: "$20" },
					{ value: 40, label: "$40" },
					{ value: 60, label: "$60" },
				]}
			/>
			<Slider
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
);

export default App;
