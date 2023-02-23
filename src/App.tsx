import "./App.css";
import { Slider } from "./components/Slider";

const App = () => (
  <div>
    <h2>Test Slider</h2>
    <div
      style={{
        margin: "100px",
      }}
    >
      <Slider
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
