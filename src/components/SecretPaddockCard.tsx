import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


function SecretPaddockCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const isTouchDevice = window.matchMedia("(hover: none)").matches;
  const lastTap = useRef(0);


  const [revealPassword, setRevealPassword] =
    useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [open]);

  function handleMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY =
      ((x / rect.width) - 0.5) * 18;

    const rotateX =
      ((y / rect.height) - 0.5) * -18;

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

  function showPassword() {
    if (revealPassword) return;

    setRevealPassword(true);

    setTimeout(() => {
      setRevealPassword(false);
    }, 500);
  }


  function handleEyesTap(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    if (!isTouchDevice) return;

    const now = Date.now();

    if (now - lastTap.current < 300) {
      showPassword();
    }

    lastTap.current = now;
  }

  function unlock() {
    if (password === "simplylovely") {
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
        onClick={() => {
          if (isTouchDevice) {
            setOpen(true);
          }
        }}
      >
        <div className="card-glow" />

        <div
          className="secret-eyes"
          onClick={handleEyesTap}
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isTouchDevice) {
              showPassword();
            }
          }}
        >
          {!revealPassword ? (
            <span className="eyes">👀</span>
          ) : (
            <div className="password-reveal">
              <strong>simplylovely</strong>

              <small>RADIO CHECK COMPLETE.</small>
            </div>
          )}
        </div>

        <h2>Secret Paddock</h2>

        <p>
          Not everything is visible at first
          glance...
        </p>

        {!isTouchDevice && (
          <button
            className="secret-button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            🔒 COME AND SEE
          </button>
        )}
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
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="secret-label">
              🔐 PADDOCK ACCESS
            </div>

            {!error ? (
              <>
                <h2>Restricted Area</h2>

                <p>
                  Apparently girls only watch
                  Formula 1 for the drivers...
                  <br />
                  Come and have some fun
                  girlstyle!
                </p>

                <div className="secret-hint">
                  <strong>Stuck?</strong>

                  <span>
                    You're only one
                    double-click away.
                  </span>
                </div>
              </>
            ) : (
              <>
                <h2 className="toto-no">
                  Toto says no.
                </h2>

                <p>
                  Apparently girls only watch
                  Formula 1 for the drivers...
                  <br />
                  Access denied.
                </p>
              </>
            )}

            <input
              ref={inputRef}
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  unlock();
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