import { useState } from "react";
import { useNavigate } from "react-router-dom";

import collage from "../assets/homepage.jpg";
import BuildPodium from "./BuildPodium";
import CreatorRanking from "./CreatorRanking";

type SecretScreen =
  | "menu"
  | "podium"
  | "creator";

function SecretPaddock() {
  const navigate = useNavigate();

  const [screen, setScreen] =
    useState<SecretScreen>("menu");

  if (screen === "podium") {
    return (
      <div className="secret-feature-screen">
        <button
          type="button"
          className="secret-back"
          onClick={() => setScreen("menu")}
        >
          ← Secret Paddock
        </button>

        <BuildPodium />
      </div>
    );
  }

  if (screen === "creator") {
    return (
      <div className="secret-feature-screen">
        <button
          type="button"
          className="secret-back"
          onClick={() => setScreen("menu")}
        >
          ← Secret Paddock
        </button>

        <CreatorRanking />
      </div>
    );
  }

  return (
    <section className="secret-home">
      <button
        type="button"
        className="secret-exit"
        onClick={() => navigate("/")}
        aria-label="Exit Secret Paddock"
        title="Return to PitWall"
      >
        ←
      </button>

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
            type="button"
            className="secret-feature"
            onClick={() => setScreen("podium")}
          >
            <div className="feature-icon">🏆</div>

            <div className="feature-text">
              <h2>Build your podium</h2>

              <p>
                Pick your dream P1, P2 and P3.
              </p>
            </div>
          </button>

          <button
            type="button"
            className="secret-feature"
            onClick={() => setScreen("creator")}
          >
            <div className="feature-icon">👑</div>

            <div className="feature-text">
              <h2>Creator&apos;s ranking</h2>

              <p>
                My completely unbiased opinions.
              </p>
            </div>
          </button>

          <button
            type="button"
            className="secret-feature"
          >
            <div className="feature-icon">📻</div>

            <div className="feature-text">
              <h2>Morning radio</h2>

              <p>
                Daily F1 messages and motivation.
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SecretPaddock;