import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function SecretPaddockCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale(1.03)
    `;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  }

  function handleLeave() {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  function unlock() {
    if (password === "girlsunite") {
      setError(false);
      setOpen(false);

      setTimeout(() => {
        navigate("/secret-paddock");
      }, 350);
    } else {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 1200);
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        className="card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="card-glow" />

        <span>👀</span>

        <h2>Secret Paddock</h2>

        <p>Not everything is visible at first glance...</p>

        <button
          className="secret-button"
          onClick={() => setOpen(true)}
        >
          🔒 COME AND SEE
        </button>
      </div>

      {open && (
        <div
          className="secret-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className={`secret-modal ${
              error ? "secret-error" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="secret-label">
              🔐 PADDOCK ACCESS
            </div>

            {!error ? (
              <>
                <h2>Restricted Area</h2>

                <p>
                  Apparently girls only watch Formula 1
                  for the drivers...
                  <br />
                  Come and have some fun!
                </p>
              </>
            ) : (
              <>
                <h2 className="toto-no">Toto says no.</h2>

                <p>
                  Apparently girls only watch Formula 1
                  for the drivers...
                  <br />
                  Access denied.
                </p>
              </>
            )}

            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") unlock();
              }}
            />

            <button
              className="unlock-button"
              onClick={unlock}
            >
              ENTER THE PADDOCK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SecretPaddockCard;