import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SecretPaddock.css";

import george from "../assets/sp/george_sp.png";
import charles from "../assets/sp/charles_sp.png";
import oscar from "../assets/sp/oscar_sp.png";
import lando from "../assets/sp/lando_sp.png";
import max from "../assets/sp/max_sp.png";
import kimi from "../assets/sp/kimi_sp.png";

import mercedesCar from "../assets/sp/mercedes_sp.png";
import mclarenCar from "../assets/sp/mclaren_sp.png";
import redbullCar from "../assets/sp/redbull_sp.png";

import BuildPodium from "./BuildPodium";
import CreatorRanking from "./CreatorRanking";
import MorningRadio from "./MorningRadio";

type SecretScreen =
  | "menu"
  | "podium"
  | "creator"
  | "radio";

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

  if (screen === "radio") {
    return (
      <div className="secret-feature-screen">
        <MorningRadio
          onExit={() => setScreen("menu")}
        />
      </div>
    );
  }

  return (
    <section className="secret-home">

      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />

      <button
        type="button"
        className="secret-exit"
        onClick={() => navigate("/")}
      >
        ←
      </button>


      <img
        src={mercedesCar}
        alt=""
        className="secret-bg-car car-left"
        draggable={false}
      />

      <img
        src={mclarenCar}
        alt=""
        className="secret-bg-car car-right"
        draggable={false}
      />

      <img
        src={redbullCar}
        alt=""
        className="secret-bg-car car-bottom"
        draggable={false}
      />


      <div className="secret-content">


        <div className="secret-header">

          <p className="secret-label">
            ACCESS GRANTED
          </p>

          <h1>SECRET PADDOCK</h1>

          <p className="secret-subtitle">
            Everything hidden behind the pit wall.
          </p>

        </div>

        <div className="secret-drivers">

          <img
            src={kimi}
            alt="Kimi Antonelli"
            className="driver kimi"
          />

          <img
            src={george}
            alt="George Russell"
            className="driver george"
          />

          <img
            src={charles}
            alt="Charles Leclerc"
            className="driver charles"
          />

          <img
            src={oscar}
            alt="Oscar Piastri"
            className="driver oscar"
          />

          <img
            src={max}
            alt="Max Verstappen"
            className="driver max"
          />

          <img
            src={lando}
            alt="Lando Norris"
            className="driver lando"
          />

        </div>

        <div className="secret-menu">

          <button
            className="secret-feature"
            onClick={() => setScreen("podium")}
          >
            <span className="feature-number">
              01
            </span>

            <div className="feature-text">
              <h2>Build your podium</h2>

              <p>
                Pick your dream P1, P2 and P3.
              </p>
            </div>
          </button>

          <button
            className="secret-feature"
            onClick={() => setScreen("creator")}
          >
            <span className="feature-number">
              02
            </span>

            <div className="feature-text">
              <h2>Creator's ranking</h2>

              <p>
                My completely unbiased opinions.
              </p>
            </div>
          </button>

          <button
            className="secret-feature"
            onClick={() => setScreen("radio")}
          >
            <span className="feature-number">
              03
            </span>

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