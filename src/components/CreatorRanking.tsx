import { useEffect, useRef, useState } from "react";

import CreatorCard from "./CreatorCard";
import { creatorRanking } from "../data/creatorRankingData";
import "./CreatorRanking.css";

const MUSIC_PATH = "/sounds/stylish-rock.mp3";
const MUSIC_FADE_START_MS = 7000;
const MUSIC_FADE_DURATION_MS = 1200;
const STARTING_VOLUME = 0.32;

function CreatorRanking() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cardsUnlocked, setCardsUnlocked] = useState(false);

  const first = creatorRanking.find(
    (driver) => driver.place === 1
  );

  const second = creatorRanking.find(
    (driver) => driver.place === 2
  );

  const thirds = creatorRanking.filter(
    (driver) => driver.place === 3
  );

  useEffect(() => {
    const audio = new Audio(MUSIC_PATH);

    audio.volume = STARTING_VOLUME;
    audio.currentTime = 0;
    audio.preload = "auto";

    audioRef.current = audio;

    let fadeInterval: number | undefined;
    let fadeTimeout: number | undefined;

    const unlockTimeout = window.setTimeout(() => {
      setCardsUnlocked(true);
    }, 5200);

    const startMusic = async () => {
      try {
        await audio.play();

        fadeTimeout = window.setTimeout(() => {
          const fadeSteps = 18;
          const intervalDuration =
            MUSIC_FADE_DURATION_MS / fadeSteps;

          const volumeDecrease =
            STARTING_VOLUME / fadeSteps;

          fadeInterval = window.setInterval(() => {
            const nextVolume = Math.max(
              0,
              audio.volume - volumeDecrease
            );

            audio.volume = nextVolume;

            if (nextVolume <= 0.01) {
              if (fadeInterval !== undefined) {
                window.clearInterval(fadeInterval);
              }

              window.clearTimeout(unlockTimeout);
              audio.pause();
              audio.currentTime = 0;
              audio.volume = STARTING_VOLUME;
            }
          }, intervalDuration);
        }, MUSIC_FADE_START_MS);
      } catch (error) {
        console.warn(
          "Creator Ranking music could not start:",
          error
        );
      }
    };

    void startMusic();

    return () => {
      if (fadeTimeout !== undefined) {
        window.clearTimeout(fadeTimeout);
      }

      if (fadeInterval !== undefined) {
        window.clearInterval(fadeInterval);
      }

      audio.pause();
      audio.currentTime = 0;

      audioRef.current = null;
    };
  }, []);

  if (!first || !second || thirds.length === 0) {
    return (
      <section className="creator-page">
        <p>Creator ranking data is unavailable.</p>
      </section>
    );
  }

  return (
    <section className="creator-page">
      <div className="creator-secret creator-interface-reveal">
        🔒 CREATOR&apos;S RANKING
      </div>

      <aside className="creator-warning creator-warning-reveal">
        <div className="creator-warning-icon">
          ⚠
        </div>

        <div>
          <div className="creator-warning-title">
            FIA DECISION
          </div>

          <p>
            Podium limit exceeded.
            <strong> No further action.</strong>
          </p>
        </div>
      </aside>

      <div className="creator-podium">
        <div className="creator-column second">
          <div className="creator-place">
            🥈 P2
          </div>

          <div className="creator-reveal creator-reveal-second">
            <CreatorCard
              driver={second}
              canFlip={cardsUnlocked}
            />
          </div>
        </div>

        <div className="creator-column first">
          <div className="creator-place">
            🥇 P1
          </div>

          <div className="creator-reveal creator-reveal-first">
            <CreatorCard
              driver={first}
              canFlip={cardsUnlocked}
            />
          </div>
        </div>

        <div className="creator-column third">
          <div className="creator-place">
            🥉 P3 · SHARED
          </div>

          <div className="creator-third-grid">
            {thirds.map((driver, index) => (
              <div
                key={driver.id}
                className={
                  index === 0
                    ? "creator-reveal creator-reveal-third"
                    : "creator-reveal creator-reveal-fourth"
                }
              >
                <CreatorCard
                  driver={driver}
                  canFlip={cardsUnlocked}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreatorRanking;