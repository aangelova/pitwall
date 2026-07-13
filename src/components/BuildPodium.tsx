import { useRef, useState } from "react";
import { drivers } from "../data/drivers";
import "./BuildPodium.css";
import {sprintQuestions, grandPrixQuestions,} from "../data/podiumQuestions";
import HeatWarning from "./HeatWarning";
import "./HeatWarning.css";
import { warnings } from "../data/warnings";


const DRIVERS_PER_PAGE = 3;

function BuildPodium() {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [screen, setScreen] = useState<
    "drivers" | "mode" | "quiz" | "warning" | "results"
  >("drivers");
  const [currentLap, setCurrentLap] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);  
  const [questions, setQuestions] = useState<string[]>([]);
  const [podium, setPodium] = useState<string[][]>([]);
  const [warningText, setWarningText] = useState("");

  const advancingRef = useRef(false);

  const totalPages = Math.ceil(drivers.length / DRIVERS_PER_PAGE);

  const currentDrivers = drivers.slice(
    currentPage * DRIVERS_PER_PAGE,
    currentPage * DRIVERS_PER_PAGE + DRIVERS_PER_PAGE
  );

  function toggleDriver(name: string) {
    if (selectedDrivers.includes(name)) {
      setSelectedDrivers(
        selectedDrivers.filter((driver) => driver !== name)
      );
      return;
    }

    if (selectedDrivers.length === 3) return;

    setSelectedDrivers([...selectedDrivers, name]);
  }

  function previousPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  const priorityQuestions =
    questions.length === 10
      ? [9, 8, 7, 6]
      : [29, 28, 18, 27];

  function breakTie(
    driverA: string,
    driverB: string,
    finalAnswers: string[]
  ) {
    for (const questionIndex of priorityQuestions) {
      const answer = finalAnswers[questionIndex];

      if (answer === driverA) {
        return -1;
      }

      if (answer === driverB) {
        return 1;
      }
    }

    return 0;
  }

  function calculatePodium(
    finalScores: Record<string, number>,
    finalAnswers: string[]
  ) {
    const remaining = [...selectedDrivers];
    const finalPodium: string[][] = [];

    while (remaining.length > 0) {
      // Highest remaining score
      const highestScore = Math.max(
        ...remaining.map(driver => finalScores[driver])
      );

      // Drivers tied on that score
      const tiedDrivers = remaining.filter(
        driver => finalScores[driver] === highestScore
      );

      // No tie
      if (tiedDrivers.length === 1) {
        finalPodium.push([tiedDrivers[0]]);
        remaining.splice(remaining.indexOf(tiedDrivers[0]), 1);
        continue;
      }

      // Resolve the tie manually
      while (tiedDrivers.length > 0) {

        const place: string[] = [tiedDrivers[0]];

        for (const challenger of tiedDrivers.slice(1)) {

          const result = breakTie(
            challenger,
            place[0],
            finalAnswers
          );

          if (result < 0) {
            place.length = 0;
            place.push(challenger);
          }

          else if (result === 0) {
            place.push(challenger);
          }

        }

        finalPodium.push([...place]);

        place.forEach(driver => {
          remaining.splice(
            remaining.indexOf(driver),
            1
          );
        });

        break;

      }
    }

    setPodium(finalPodium);
  }

  function nextLap() {
    if (!currentChoice || advancingRef.current) return;

    advancingRef.current = true;

    const chosenDriver = currentChoice;

    const updatedScores = {
      ...scores,
      [chosenDriver]: (scores[chosenDriver] ?? 0) + 1,
    };

    const updatedAnswers = [...answers, chosenDriver];

    setScores(updatedScores);
    setAnswers(updatedAnswers);
    setCurrentChoice(null);

    if (currentLap === questions.length - 1) {
      calculatePodium(updatedScores, updatedAnswers);
      const randomWarning =
        warnings[Math.floor(Math.random() * warnings.length)];

      setWarningText(randomWarning);

      setScreen("warning");
      advancingRef.current = false;
      return;
    }

    setCurrentLap((previous) => previous + 1);
    advancingRef.current = false;
  }

  return (
    <section className="podium-page">

      {screen === "drivers" && (
        <>
          <div className="podium-header">
            <p>BUILD YOUR PODIUM</p>

            <h1>Choose your drivers</h1>

            <span>Select exactly 3 drivers.</span>
          </div>

          <div className="selected-drivers">
            {selectedDrivers.map((driver, index) => (
              <div key={driver} className="selected-slot">
                <span>{index + 1}</span>
                <p>{driver}</p>
              </div>
            ))}

            {Array.from({
              length: 3 - selectedDrivers.length,
            }).map((_, index) => (
              <div key={index} className="selected-slot empty">
                <span>{selectedDrivers.length + index + 1}</span>
                <p>Empty</p>
              </div>
            ))}
          </div>

          <div className="driver-carousel">
            <div className="driver-grid">
              {currentDrivers.map((driver) => {
                const isSelected =
                  selectedDrivers.includes(driver.name);

                const selectionNumber =
                  selectedDrivers.indexOf(driver.name) + 1;

                return (
                  <div
                    key={driver.id}
                    className={`driver-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => toggleDriver(driver.name)}
                  >
                    <div
                      className={`selection-circle ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      {isSelected ? selectionNumber : ""}
                    </div>

                    <div className="driver-image">
                      <img
                        src={driver.image}
                        alt={driver.name}
                      />
                    </div>

                    <div className="driver-content">
                      <h3>{driver.name}</h3>

                      <p>{driver.nationality}</p>

                      <div className="driver-details">
                        <span>{driver.birthYear}</span>
                        <span>{driver.height} cm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="carousel-controls">
            <button
              className="scroll-btn"
              onClick={previousPage}
              disabled={currentPage === 0}
            >
              ◀
            </button>

            <div className="page-dots">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={index === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>

            <button
              className="scroll-btn"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              ▶
            </button>
          </div>

          <button
            className="continue-btn"
            disabled={selectedDrivers.length !== 3}
            onClick={() => setScreen("mode")}
          >
            Continue →
          </button>
        </>
      )}

      {screen === "mode" && (
        <div className="mode-page">

          <div className="podium-header">
            <p>YOUR LINEUP IS LOCKED</p>

            <h1>Choose your race weekend</h1>

            <span>
              The drivers are ready. Now choose your race format.
            </span>
          </div>

          <div className="mode-grid">

            <button
              className="mode-card"
              onClick={() => {
                const startingScores: Record<string, number> = {};

                selectedDrivers.forEach((driver) => {
                  startingScores[driver] = 0;
                });

                setScores(startingScores);
                setAnswers([]);
                setCurrentChoice(null);
                setCurrentLap(0);
                setQuestions(sprintQuestions);
                setScreen("quiz");
              }}
            >
              <div className="mode-icon">🏁</div>

              <h2>Sprint Race</h2>

              <p className="mode-tagline">
                For the busy girlies.
              </p>

              <span>10 laps</span>
            </button>

            <button
              className="mode-card"
              onClick={() => {
                const startingScores: Record<string, number> = {};

                selectedDrivers.forEach((driver) => {
                  startingScores[driver] = 0;
                });

                setScores(startingScores);
                setAnswers([]);
                setCurrentChoice(null);
                setCurrentLap(0);

                setQuestions(grandPrixQuestions);
                setScreen("quiz");
              }}
            >
              <div className="mode-icon">🏆</div>

              <h2>Grand Prix</h2>

              <p className="mode-tagline">
                Commitment issues? Not here.
              </p>

              <span>30 laps</span>
            </button>

          </div>
        </div>
      )}

      {screen === "quiz" && (
        <div className="quiz-page">

            <p className="lap-counter">
              Lap {currentLap + 1} / {questions.length}
            </p>

            <h2 className="quiz-question">
              {questions[currentLap]}
            </h2>

            <div className="quiz-options">

                {selectedDrivers.map((driverName) => {
                  const driver = drivers.find(
                    (d) => d.name === driverName
                  );

                  if (!driver) return null;

                  return (

                    <button
                      key={driver.id}
                      className={`quiz-driver ${
                        currentChoice === driver.name ? "selected" : ""
                      }`}
                      onClick={() => setCurrentChoice(driver.name)}
                    >
                      <img
                        src={driver.image}
                        alt={driver.name}
                      />

                      <span>{driver.name}</span>
                    </button>
                  );
                })}

                

            </div>

            <div className="quiz-controls">
              <button
                className="continue-btn"
                disabled={!currentChoice}
                onClick={nextLap}
              >
                {currentLap === questions.length - 1
                  ? "🏁 Finish Race"
                  : "Next Lap →"}
              </button>
            </div>

        </div>
      )}

      {screen === "warning" && (
        <HeatWarning
          warning={warningText}
          onContinue={() => setScreen("results")}
        />
      )}

     {screen === "results" && (
      <div className="results-page">

        <h1>Your Podium</h1>

        <div className="podium">

          {podium.map((place, index) => {

            const placeClass =
              index === 0
                ? "first"
                : index === 1
                ? "second"
                : "third";

            return place.map(driverName => {

              const driver = drivers.find(
                d => d.name === driverName
              );

              return (
                <div
                  key={driverName}
                  className={`podium-place ${placeClass}`}
                >

                  <img
                    src={driver?.image}
                    alt={driverName}
                  />

                  <h2>{driverName}</h2>

                  <span>
                    {index === 0
                      ? "P1"
                      : index === 1
                      ? "P2"
                      : "P3"}
                  </span>

                </div>
              );

            });

          })}

        </div>

      </div>
    )}

    </section>

    
  );
}

export default BuildPodium;