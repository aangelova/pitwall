import { useState } from "react";
import collage from "../assets/homepage.jpg";
import BuildPodium from "./BuildPodium";

function SecretPaddock() {
  const [screen, setScreen] = useState<"menu" | "podium">("menu");

  if (screen === "podium") {
    return <BuildPodium />;
  }

  return (
    <section className="secret-home">
      <div className="secret-header">
        <p>ACCESS GRANTED</p>

        <h1>SECRET PADDOCK</h1>

        <p className="secret-subtitle">
          Everything hidden behind the pit wall.
        </p>
      </div>

      <div className="secret-layout">
        <img
          src={collage}
          alt="Formula 1 collage"
          className="secret-cover"
        />

        <div className="secret-menu">
          <button
            className="secret-feature"
            onClick={() => setScreen("podium")}
          >
            <div className="feature-icon">🏆</div>

            <div className="feature-text">
              <h2>Build your podium</h2>
              <p>Pick your dream P1, P2 and P3.</p>
            </div>
          </button>

          <button className="secret-feature">
            <div className="feature-icon">👑</div>

            <div>
              <h2>Creator's ranking</h2>

              <p>My completely unbiased opinions.</p>
            </div>
          </button>

          <button className="secret-feature">
            <div className="feature-icon">📻</div>

            <div>
              <h2>Morning radio</h2>

              <p>Daily F1 messages and motivation.</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SecretPaddock;