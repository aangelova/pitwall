import "./App.css";
import FeatureCard from "./components/FeatureCard";
import DriverBattle from "./components/DriverBattle";

function App() {
  
  return (
    <main className="app">
      <nav className="navbar">
        <h2>PitWall</h2>

        <div className="nav-links">
          <a>Dashboard</a>
          <a>Driver Battle</a>
          <a>About</a>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">F1 DATA PROJECT</div>

        <h1>PitWall</h1>

        <p>
          Formula 1 analytics dashboard for race weekends, lap times, weather,
          and driver battles.
        </p>

        <DriverBattle />

        <div className="cards">
          <FeatureCard
            icon="🏁"
            title="Race Dashboard"
            description="Explore sessions, lap times, weather, and race control messages."
          />

          <FeatureCard
            icon="⚔️"
            title="Driver Battle"
            description="Compare two drivers by pace, consistency, and performance."
          />

          <FeatureCard
            icon="📊"
            title="Session Analytics"
            description="Turn raw F1 data into clean charts and useful insights."
          />
        </div>
      </section>
    </main>
  );
}

export default App;