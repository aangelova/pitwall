import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./App.css";
import FeatureCard from "./components/FeatureCard";
import DriverBattle from "./components/DriverBattle";
import About from "./components/About";
import StartLights from "./components/StartLights";
import SecretPaddockCard from "./components/SecretPaddockCard";
import RacingLine from "./components/RacingLine";
import SecretPaddock from "./components/SecretPaddock";

function HomePage() {
  return (
    <section className="hero">
      <div className="badge">FOR F1 FANS, BY AN F1 FAN</div>

      <h1>PitWall</h1>

      <p>
        Explore Formula 1 through interactive driver battles, detailed
        statistics, and unique fan experiences built with real racing data.
      </p>

      <div className="cards">
        <FeatureCard
          icon="⚔️"
          title="Driver Battle"
          description="Compare any two Formula 1 drivers using real season statistics and see who comes out on top."
        />

        <FeatureCard
          icon="🏎️"
          title="Track Battle"
          description="Coming soon — compare Formula 1 circuits by speed, layout, history and racing characteristics."
        />

        <SecretPaddockCard />
      </div>
    </section>
  );
}

function App() {
  const [introFinished, setIntroFinished] = useState(false);

  if (!introFinished) {
    return (
      <StartLights
        onFinish={() => setIntroFinished(true)}
      />
    );
  }

  return (
    <main className="app">

      <RacingLine />

      <nav className="navbar">
        <h2>🏎️ PitWall</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/driver-battle">Driver Battle</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-battle" element={<DriverBattle />} />
        <Route path="/about" element={<About />} />
        <Route path="/secret-paddock" element={<SecretPaddock />} />
      </Routes>
    </main>
  );
}

export default App;