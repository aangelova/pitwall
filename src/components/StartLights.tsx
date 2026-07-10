import { useEffect, useRef, useState } from "react";

type Props = {
  onFinish: () => void;
};

function StartLights({ onFinish }: Props) {
  const [lights, setLights] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setLights(1), 400),
      setTimeout(() => setLights(2), 700),
      setTimeout(() => setLights(3), 1000),
      setTimeout(() => setLights(4), 1300),
      setTimeout(() => setLights(5), 1600),

      setTimeout(() => setReady(true), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  async function startRace() {
    try {
      await audioRef.current?.play();
    } catch {}

    setTimeout(() => {
      setLightsOut(true);
    }, 2050);

    setTimeout(() => {
      setFlash(true);
    }, 2150);

    setTimeout(() => {
      onFinish();
    }, 2350);
  }

  return (
    <div className="lights-screen">
      {flash && <div className="flash-overlay" />}

      <audio
        ref={audioRef}
        src="/sounds/engine_rev.mp3"
      />

      <div className="lights-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`light ${lights >= n && !lightsOut ? "active" : ""}`}
          />
        ))}
      </div>

      {!ready ? (
        <p className="lights-text">
          LIGHTS OUT...
        </p>
      ) : (
        <button
          className="start-engine"
          onClick={startRace}
        >
          START ENGINE
        </button>
      )}
    </div>
  );
}

export default StartLights;