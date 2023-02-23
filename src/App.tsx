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
        color="red"
        showLabelOnHover={true}
        onChange={(value) => console.log(`Red Slider Value: ${value}`)}
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
        color="violet"
        showLabelOnHover={true}
        onChange={(value) => console.log(`Purple Slider Value: ${value}`)}
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
