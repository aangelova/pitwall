import { Link, Route, Routes } from "react-router-dom";

import "./App.css";
import FeatureCard from "./components/FeatureCard";
import DriverBattle from "./components/DriverBattle";
import About from "./components/About";

function HomePage() {
  return (
    <section className="hero">
      <div className="badge">F1 DATA PROJECT</div>

      <h1>PitWall</h1>

      <p>
        Formula 1 analytics dashboard for race weekends, lap times, weather,
        and driver battles.
      </p>

      <div className="cards">
        <FeatureCard
          icon="🏁"
          title="Race Dashboard"
          description="Explore sessions, lap times, weather, and race control messages."
        />

        <FeatureCard
          icon="⚔️"
          title="Driver Battle"
          description="Compare two drivers through interactive battle views."
        />

        <FeatureCard
          icon="📊"
          title="Session Analytics"
          description="Turn raw F1 data into clean charts and useful insights."
        />
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="app">
      <nav className="navbar">
        <h2>PitWall</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a>Dashboard</a>
          <Link to="/driver-battle">Driver Battle</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver-battle" element={<DriverBattle />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  );
}

export default App;