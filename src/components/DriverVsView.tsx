import { useEffect, useState } from "react";
import { getSeasonDriverStats, type SeasonDriverStats } from "../services/seasonStats";

type DriverVsViewProps = {
  driver1Name: string;
  driver2Name: string;
  driver1Team: string;
  driver2Team: string;
  driver1Number: number;
  driver2Number: number;
  driver1Color: string;
  driver2Color: string;
  driver1Image: string;
  driver2Image: string;
};

type StatKey =
  | "points"
  | "wdcPosition"
  | "wins"
  | "pointsPerRace"
  | "pointsBehindLeader"
  | "winRate"
  | "podiums"
  | "top5Finishes"
  | "top10Finishes"
  | "dnf"
  | "dns"
  | "dsq"
  | "classifiedFinishes";

type StatCategory = "season" | "finishing" | "reliability";


function DriverVsView({
  driver1Name,
  driver2Name,
  driver1Team,
  driver2Team,
  driver1Number,
  driver2Number,
  driver1Color,
  driver2Color,
  driver1Image,
  driver2Image,
}: DriverVsViewProps) {
  const [selectedStat, setSelectedStat] = useState<StatKey>("points");
  const [activeCategory, setActiveCategory] = useState<StatCategory>("season");
  const [revealedStats, setRevealedStats] = useState<StatKey[]>([]);

  const [driver1Stats, setDriver1Stats] = useState<SeasonDriverStats | null>(null);
  const [driver2Stats, setDriver2Stats] = useState<SeasonDriverStats | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setRevealedStats([]);
    setSelectedStat("points");

    Promise.all([
      getSeasonDriverStats(driver1Name),
      getSeasonDriverStats(driver2Name),
    ])
      .then(([stats1, stats2]) => {
        setDriver1Stats(stats1);
        setDriver2Stats(stats2);
      })
      .catch((error) => {
        console.error("Failed to load season stats:", error);
        setDriver1Stats(null);
        setDriver2Stats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [driver1Name, driver2Name]);

  const stats = {
    points: {
      label: "🏆 Points",
      d1: driver1Stats?.points ?? null,
      d2: driver2Stats?.points ?? null,
      lowerIsBetter: false,
      format: (value: number | null) =>
        value === null ? "No data" : `${value} pts`,
    },
    wdcPosition: {
      label: "👑 WDC Position",
      d1: driver1Stats?.wdcPosition ?? null,
      d2: driver2Stats?.wdcPosition ?? null,
      lowerIsBetter: true,
      format: (value: number | null) =>
        value === null || value === 0 ? "No data" : `P${value}`,
    },
    wins: {
      label: "🥇 Wins",
      d1: driver1Stats?.wins ?? null,
      d2: driver2Stats?.wins ?? null,
      lowerIsBetter: false,
      format: (value: number | null) => `${value ?? 0}`,
    },
    pointsPerRace: {
      label: "📈 Points/Race",
      d1: driver1Stats?.pointsPerRace ?? null,
      d2: driver2Stats?.pointsPerRace ?? null,
      lowerIsBetter: false,
      format: (value: number | null) =>
        value === null ? "No data" : `${value.toFixed(1)}`,
    },
    pointsBehindLeader: {
      label: "⏳ Gap to Leader",
      d1: driver1Stats?.pointsBehindLeader ?? null,
      d2: driver2Stats?.pointsBehindLeader ?? null,
      lowerIsBetter: true,
      format: (value: number | null) =>
        value === null ? "No data" : `${value} pts`,
    },
    winRate: {
      label: "🔥 Win Rate",
      d1: driver1Stats?.winRate ?? null,
      d2: driver2Stats?.winRate ?? null,
      lowerIsBetter: false,
      format: (value: number | null) =>
        value === null ? "No data" : `${value.toFixed(1)}%`,
    },

    podiums: {
      label: "🥂 Podiums",
      d1: driver1Stats?.podiums ?? null,
      d2: driver2Stats?.podiums ?? null,
      lowerIsBetter: false,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    top5Finishes: {
      label: "🔝 Top 5s",
      d1: driver1Stats?.top5Finishes ?? null,
      d2: driver2Stats?.top5Finishes ?? null,
      lowerIsBetter: false,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    top10Finishes: {
      label: "📍 Top 10s",
      d1: driver1Stats?.top10Finishes ?? null,
      d2: driver2Stats?.top10Finishes ?? null,
      lowerIsBetter: false,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    dnf: {
      label: "💥 DNFs",
      d1: driver1Stats?.dnf ?? null,
      d2: driver2Stats?.dnf ?? null,
      lowerIsBetter: true,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    dns: {
      label: "🚫 DNS",
      d1: driver1Stats?.dns ?? null,
      d2: driver2Stats?.dns ?? null,
      lowerIsBetter: true,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    dsq: {
      label: "🚩 DSQs",
      d1: driver1Stats?.dsq ?? null,
      d2: driver2Stats?.dsq ?? null,
      lowerIsBetter: true,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
    classifiedFinishes: {
      label: "🏁 Classified",
      d1: driver1Stats?.classifiedFinishes ?? null,
      d2: driver2Stats?.classifiedFinishes ?? null,
      lowerIsBetter: false,
      format: (v: number | null) => v === null ? "No data" : `${v}`,
    },
  };

  const statGroups: Record<StatCategory, StatKey[]> = {
    season: [
      "points",
      "wdcPosition",
      "wins",
      "pointsPerRace",
      "pointsBehindLeader",
      "winRate",
    ],

    finishing: [
      "podiums",
      "top5Finishes",
      "top10Finishes",
      "classifiedFinishes",
    ],

    reliability: [
      "dnf",
      "dns",
      "dsq",
    ],
  };

  const getWinner = (
    d1: number | null,
    d2: number | null,
    lowerIsBetter: boolean
  ) => {
    if (d1 === null || d2 === null || d1 === d2) return "Tie";
    if (lowerIsBetter) return d1 < d2 ? "Driver 1" : "Driver 2";
    return d1 > d2 ? "Driver 1" : "Driver 2";
  };

  const statKeys = Object.keys(stats) as StatKey[];
  const activeStat = stats[selectedStat];
  const activeStatRevealed = revealedStats.includes(selectedStat);

  const score = revealedStats.reduce(
    (currentScore, key) => {
      const stat = stats[key];
      const winner = getWinner(stat.d1, stat.d2, stat.lowerIsBetter);

      if (winner === "Driver 1") {
        return { driver1: currentScore.driver1 + 1, driver2: currentScore.driver2 };
      }

      if (winner === "Driver 2") {
        return { driver1: currentScore.driver1, driver2: currentScore.driver2 + 1 };
      }

      return currentScore;
    },
    { driver1: 0, driver2: 0 }
  );

  const revealStat = (key: StatKey) => {
    setSelectedStat(key);

    if (!revealedStats.includes(key)) {
      setRevealedStats([...revealedStats, key]);
    }
  };

  const activeWinner = getWinner(
    activeStat.d1,
    activeStat.d2,
    activeStat.lowerIsBetter
  );

  const allStatsRevealed = revealedStats.length === statKeys.length;

  return (
    <div className="driver-vs-layout">
      <div className="battle-score">
        <span style={{ color: driver1Color }}>{driver1Name.split(" ")[0]}</span>

        <div className="score-box">
          <strong>{score.driver1}</strong>
          <span>-</span>
          <strong>{score.driver2}</strong>
        </div>

        <span style={{ color: driver2Color }}>{driver2Name.split(" ")[0]}</span>
      </div>

      {allStatsRevealed && (
        <div className="final-winner">
          🏆 Final Winner:{" "}
          {score.driver1 > score.driver2
            ? driver1Name
            : score.driver2 > score.driver1
            ? driver2Name
            : "Tie"}
        </div>
      )}

      <div className="stat-category-tabs">
        <button
          className={activeCategory === "season" ? "active" : ""}
          onClick={() => setActiveCategory("season")}
        >
          🏆 Season
        </button>

        <button
          className={activeCategory === "finishing" ? "active" : ""}
          onClick={() => setActiveCategory("finishing")}
        >
          🏁 Finishing
        </button>

        <button
          className={activeCategory === "reliability" ? "active" : ""}
          onClick={() => setActiveCategory("reliability")}
        >
          ⚙️ Reliability
        </button>
      </div>

      <div className="vs-arena">
        <div className="driver-side left">
          <p className="driver-number" style={{ color: driver1Color }}>
            #{driver1Number}
          </p>
          <h2>{driver1Name}</h2>
          <p>{driver1Team}</p>

          <div className="stat-list">
            {statGroups[activeCategory].map((key) => {
              const isRevealed = revealedStats.includes(key);

              return (
                <button
                  key={key}
                  className={selectedStat === key ? "stat-pill active" : "stat-pill"}
                  onClick={() => revealStat(key)}
                >
                  <span>{stats[key].label}</span>
                  <strong>
                    {loading
                      ? "..."
                      : isRevealed
                      ? stats[key].format(stats[key].d1)
                      : "Tap to reveal"}
                  </strong>
                </button>
              );
            })}
          </div>
        </div>

        <img
          src={driver1Image}
          alt={driver1Name}
          className="vs-driver-image"
          style={{ filter: `drop-shadow(0 0 35px ${driver1Color})` }}
        />

        <div className="center-battle">
          <div className="big-vs">VS</div>

          <div className="active-stat-card">
            <h3>{activeStat.label}</h3>

            {activeStatRevealed ? (
              <>
                <div className="stat-result-row">
                  <span>{activeStat.format(activeStat.d1)}</span>
                  <span>{activeStat.format(activeStat.d2)}</span>
                </div>

                <p>
                  🏆{" "}
                  {activeWinner === "Driver 1"
                    ? driver1Name
                    : activeWinner === "Driver 2"
                    ? driver2Name
                    : "Tie"}
                </p>
              </>
            ) : (
              <p>Choose this stat to reveal the season battle.</p>
            )}
          </div>
        </div>

        <img
          src={driver2Image}
          alt={driver2Name}
          className="vs-driver-image"
          style={{ filter: `drop-shadow(0 0 35px ${driver2Color})` }}
        />

        <div className="driver-side right">
          <p className="driver-number" style={{ color: driver2Color }}>
            #{driver2Number}
          </p>
          <h2>{driver2Name}</h2>
          <p>{driver2Team}</p>

          <div className="stat-list">
            {statGroups[activeCategory].map((key) => {
              const isRevealed = revealedStats.includes(key);

              return (
                <button
                  key={key}
                  className={selectedStat === key ? "stat-pill active" : "stat-pill"}
                  onClick={() => revealStat(key)}
                >
                  <span>{stats[key].label}</span>
                  <strong>
                    {loading
                      ? "..."
                      : isRevealed
                      ? stats[key].format(stats[key].d2)
                      : "Tap to reveal"}
                  </strong>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverVsView;