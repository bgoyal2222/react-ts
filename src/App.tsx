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
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
      />
    </div>
  </div>
);

export default App;
