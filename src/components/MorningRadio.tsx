import {
  useEffect,
  useRef,
  useState,
} from "react";

import morningRadioMessages from "../data/morningRadioMessages";

import georgeThumbsup from "../assets/radio/george_thumbsup.png";
import landoThumbsup from "../assets/radio/lando_thumbsup.png";
import oscarThumbsup from "../assets/radio/oscar_thumbsup.png";

import "./MorningRadio.css";

const BEEP_PATH = "/sounds/beep.mp3";
const TRANSMISSION_DELAY_MS = 850;
const TYPEWRITER_SPEED_MS = 28;

type Props = {
  onExit: () => void;
};

function getRandomMessage(previous: string) {
  if (morningRadioMessages.length === 0) {
    return "Radio check. You're doing better than you think.";
  }

  if (morningRadioMessages.length === 1) {
    return morningRadioMessages[0];
  }

  let nextMessage = previous;

  while (nextMessage === previous) {
    const randomIndex = Math.floor(
      Math.random() *
        morningRadioMessages.length
    );

    nextMessage =
      morningRadioMessages[randomIndex];
  }

  return nextMessage;
}

function MorningRadio({ onExit }: Props) {
  const beepRef =
    useRef<HTMLAudioElement | null>(null);

  const transmissionTimeoutRef =
    useRef<number | null>(null);

  const [started, setStarted] =
    useState(false);

  const [showRadio, setShowRadio] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [displayedText, setDisplayedText] =
    useState("");

  const [finished, setFinished] =
    useState(false);

  const [typingKey, setTypingKey] =
    useState(0);

  const [isConnecting, setIsConnecting] =
    useState(false);

  const [showGoodbye, setShowGoodbye] =
    useState(false);

  useEffect(() => {
    const audio = new Audio(BEEP_PATH);

    audio.preload = "auto";
    beepRef.current = audio;

    return () => {
      if (
        transmissionTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          transmissionTimeoutRef.current
        );
      }

      audio.pause();
      audio.currentTime = 0;

      beepRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!showRadio || !message) {
      return;
    }

    setDisplayedText("");
    setFinished(false);

    let characterIndex = 0;

    const typingInterval =
      window.setInterval(() => {
        characterIndex += 1;

        setDisplayedText(
          message.slice(0, characterIndex)
        );

        if (
          characterIndex >= message.length
        ) {
          window.clearInterval(
            typingInterval
          );

          setFinished(true);
        }
      }, TYPEWRITER_SPEED_MS);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [message, typingKey, showRadio]);

  const playBeep = async () => {
    const audio = beepRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.pause();
      audio.currentTime = 0;

      await audio.play();
    } catch {
    }
  };

  const beginTransmission = async (
    newMessage: string
  ) => {
    if (transmissionTimeoutRef.current) {
      window.clearTimeout(
        transmissionTimeoutRef.current
      );
    }

    setFinished(false);
    setDisplayedText("");
    setIsConnecting(true);

    await playBeep();

    transmissionTimeoutRef.current =
      window.setTimeout(() => {
        setMessage(newMessage);
        setTypingKey(
          (currentKey) => currentKey + 1
        );

        setShowRadio(true);
        setIsConnecting(false);

        transmissionTimeoutRef.current =
          null;
      }, TRANSMISSION_DELAY_MS);
  };

  const playMorningRadio = async () => {
    if (started || isConnecting) {
      return;
    }

    setStarted(true);

    await beginTransmission(
      getRandomMessage("")
    );
  };

  const replayTransmission = async () => {
    if (!message || isConnecting) {
      return;
    }

    await beginTransmission(message);
  };

  const requestAnotherBriefing =
    async () => {
      if (isConnecting) {
        return;
      }

      await beginTransmission(
        getRandomMessage(message)
      );
    };

  const handleBack = () => {
    if (started && message) {
      setShowGoodbye(true);
      return;
    }

    onExit();
  };

  const confirmExit = () => {
    setShowGoodbye(false);
    onExit();
  };

  return (
    <section className="radio-page">
      <button
        type="button"
        className="radio-back"
        onClick={handleBack}
      >
        ← Secret Paddock
      </button>

      {!showRadio && (
        <div className="radio-intro">
          <div className="radio-intro-icon">
            📻
          </div>

          <div className="radio-badge">
            PIT WALL TRANSMISSION
          </div>

          <h1>Morning Radio</h1>

          <p>
            Receive today&apos;s engineer
            message before lights out.
          </p>

          <button
            type="button"
            className="radio-play-button"
            onClick={playMorningRadio}
            disabled={isConnecting}
          >
            {isConnecting
              ? "📡 Connecting to Pit Wall..."
              : "▶ Play Today's Morning Radio"}
          </button>
        </div>
      )}

      {showRadio && (
        <div className="radio-container">
          <div className="radio-header">
            <div className="radio-live">
              <span className="radio-live-dot" />
              PIT WALL LIVE
            </div>

            <div className="radio-title">
              F1 ENGINEER RADIO
            </div>
          </div>

          <div
            className={
              finished
                ? "radio-wave radio-wave-finished"
                : "radio-wave"
            }
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="radio-message">
            {isConnecting ? (
              <span className="radio-connecting">
                Opening another radio
                channel...
              </span>
            ) : (
              <>
                {displayedText}

                {!finished && (
                  <span className="radio-cursor">
                    |
                  </span>
                )}
              </>
            )}
          </div>

          {finished && !isConnecting && (
            <div className="radio-finished">
              <div className="radio-divider" />

              <div className="radio-finished-label">
                TRANSMISSION COMPLETE
              </div>

              <div className="radio-buttons">
                <button
                  type="button"
                  className="radio-action"
                  onClick={
                    replayTransmission
                  }
                >
                  🔁 Replay Transmission
                </button>

                <button
                  type="button"
                  className="radio-action primary"
                  onClick={
                    requestAnotherBriefing
                  }
                >
                  📡 Request Another Briefing
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showGoodbye && (
        <div
          className="radio-goodbye-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowGoodbye(false);
            }
          }}
        >
          <div
            className="radio-goodbye"
            role="dialog"
            aria-modal="true"
            aria-labelledby="radio-goodbye-title"
          >
            <button
              type="button"
              className="radio-goodbye-close"
              onClick={() =>
                setShowGoodbye(false)
              }
              aria-label="Close goodbye message"
            >
              ×
            </button>

            <div className="radio-goodbye-label">
              📻 FINAL RADIO MESSAGE
            </div>

            <h2 id="radio-goodbye-title">
              Engineer signing off.
            </h2>

            <p>
              Copy that. We&apos;ll see you
              on tomorrow&apos;s formation
              lap.
            </p>

            <div className="radio-goodbye-drivers">
              <img
                src={landoThumbsup}
                alt="Lando giving a thumbs up"
                className="radio-goodbye-driver radio-goodbye-lando"
              />

              <img
                src={georgeThumbsup}
                alt="George giving a thumbs up"
                className="radio-goodbye-driver radio-goodbye-george"
              />

              <img
                src={oscarThumbsup}
                alt="Oscar giving two thumbs up"
                className="radio-goodbye-driver radio-goodbye-oscar"
              />
            </div>

            <div className="radio-goodbye-actions">
              <button
                type="button"
                className="radio-goodbye-stay"
                onClick={() =>
                  setShowGoodbye(false)
                }
              >
                Keep Listening
              </button>

              <button
                type="button"
                className="radio-goodbye-exit"
                onClick={confirmExit}
              >
                Return to Secret Paddock
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MorningRadio;