import { useState } from "react";
import { ClockworkDial } from "./components/ClockworkDial/ClockworkDial";
import "./styles.css";

const dotOptions = [6, 8, 10, 12];

export default function App() {
  const [dotCount, setDotCount] = useState(6);
  const [value, setValue] = useState(1);
  const [gearSpeed, setGearSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const changeDotCount = (nextCount: number) => {
    setDotCount(nextCount);
    setValue(1);
  };
  const next = () =>
    setValue((current) => (current >= dotCount ? 1 : current + 1));
  const previous = () =>
    setValue((current) => (current <= 1 ? dotCount : current - 1));

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">SVG mechanical UI</p>
          <h1>Clockwork Dial</h1>
          <p className="description">
            A reusable React + TypeScript clockwork selector with calculated
            gear ratios, discrete indicator sockets, keyboard controls, and
            efficient requestAnimationFrame gear animation.
          </p>
        </div>
        <ClockworkDial
          value={value}
          min={1}
          max={dotCount}
          dotCount={dotCount}
          gearSpeed={gearSpeed}
          size="min(82vw, 460px)"
          paused={paused}
          onChange={setValue}
        />
      </section>
      <section className="panel" aria-label="Demo controls">
        <strong>Current value: {value}</strong>
        <div className="buttonRow">
          <button onClick={previous}>Previous</button>
          <button onClick={next}>Next</button>
          <button onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={() => setValue(1)}>Reset</button>
        </div>
        <label>
          Gear speed{" "}
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={gearSpeed}
            onChange={(event) => setGearSpeed(Number(event.target.value))}
          />{" "}
          {gearSpeed.toFixed(1)}x
        </label>
        <label>
          Dot count{" "}
          <select
            value={dotCount}
            onChange={(event) => changeDotCount(Number(event.target.value))}
          >
            {dotOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>
    </main>
  );
}
