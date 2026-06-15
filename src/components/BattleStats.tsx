import { useEffect, useState } from "react";

type BattleStatsProps = {
  driver1Number: number;
  driver2Number: number;
};

type OpenF1Lap = {
  driver_number: number;
  lap_duration: number | null;
  lap_number: number;
};

type StatType = "fastest" | "average" | "slowest" | "total";

function BattleStats({ driver1Number, driver2Number }: BattleStatsProps) {
  const [selectedStat, setSelectedStat] = useState<StatType>("fastest");

  const [driver1FastestLap, setDriver1FastestLap] = useState<number | null>(null);
  const [driver2FastestLap, setDriver2FastestLap] = useState<number | null>(null);

  const [driver1AverageLap, setDriver1AverageLap] = useState<number | null>(null);
  const [driver2AverageLap, setDriver2AverageLap] = useState<number | null>(null);

  const [driver1SlowestLap, setDriver1SlowestLap] = useState<number | null>(null);
  const [driver2SlowestLap, setDriver2SlowestLap] = useState<number | null>(null);

  const [driver1TotalLaps, setDriver1TotalLaps] = useState(0);
  const [driver2TotalLaps, setDriver2TotalLaps] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch("https://api.openf1.org/v1/laps?session_key=latest")
      .then((response) => response.json())
      .then((laps: OpenF1Lap[]) => {
        const driver1Laps = laps.filter(
          (lap) => lap.driver_number === driver1Number && lap.lap_duration !== null
        );

        const driver2Laps = laps.filter(
          (lap) => lap.driver_number === driver2Number && lap.lap_duration !== null
        );

        const driver1Durations = driver1Laps.map((lap) => lap.lap_duration!);
        const driver2Durations = driver2Laps.map((lap) => lap.lap_duration!);

        setDriver1FastestLap(
          driver1Durations.length > 0 ? Math.min(...driver1Durations) : null
        );
        setDriver2FastestLap(
          driver2Durations.length > 0 ? Math.min(...driver2Durations) : null
        );

        setDriver1SlowestLap(
          driver1Durations.length > 0 ? Math.max(...driver1Durations) : null
        );
        setDriver2SlowestLap(
          driver2Durations.length > 0 ? Math.max(...driver2Durations) : null
        );

        setDriver1AverageLap(
          driver1Durations.length > 0
            ? driver1Durations.reduce((sum, lap) => sum + lap, 0) /
                driver1Durations.length
            : null
        );
        setDriver2AverageLap(
          driver2Durations.length > 0
            ? driver2Durations.reduce((sum, lap) => sum + lap, 0) /
                driver2Durations.length
            : null
        );

        setDriver1TotalLaps(driver1Durations.length);
        setDriver2TotalLaps(driver2Durations.length);

        setLoading(false);
      });
  }, [driver1Number, driver2Number]);

  const formatLapTime = (seconds: number | null) => {
    if (seconds === null) return "No data";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, "0")}`;
  };

  const getStatValues = () => {
    if (selectedStat === "fastest") {
      return {
        title: "Fastest Lap",
        driver1Value: driver1FastestLap,
        driver2Value: driver2FastestLap,
        lowerIsBetter: true,
        formatter: formatLapTime,
      };
    }

    if (selectedStat === "average") {
      return {
        title: "Average Lap",
        driver1Value: driver1AverageLap,
        driver2Value: driver2AverageLap,
        lowerIsBetter: true,
        formatter: formatLapTime,
      };
    }

    if (selectedStat === "slowest") {
      return {
        title: "Slowest Lap",
        driver1Value: driver1SlowestLap,
        driver2Value: driver2SlowestLap,
        lowerIsBetter: true,
        formatter: formatLapTime,
      };
    }

    return {
      title: "Total Laps",
      driver1Value: driver1TotalLaps,
      driver2Value: driver2TotalLaps,
      lowerIsBetter: false,
      formatter: (value: number | null) =>
        value === null ? "No data" : `${value} laps`,
    };
  };

  const stat = getStatValues();

  const winner =
    stat.driver1Value !== null && stat.driver2Value !== null
      ? stat.lowerIsBetter
        ? stat.driver1Value < stat.driver2Value
          ? "Driver 1"
          : "Driver 2"
        : stat.driver1Value > stat.driver2Value
          ? "Driver 1"
          : "Driver 2"
      : null;

  if (loading) {
    return (
      <div className="battle-summary">
        <h3>Loading Battle Stats...</h3>
        <p>Fetching lap data from OpenF1...</p>
      </div>
    );
  }

  return (
    <div className="battle-summary">
      <h3>{stat.title} Battle</h3>

      <select
        value={selectedStat}
        onChange={(event) => setSelectedStat(event.target.value as StatType)}
      >
        <option value="fastest">Fastest Lap</option>
        <option value="average">Average Lap</option>
        <option value="slowest">Slowest Lap</option>
        <option value="total">Total Laps</option>
      </select>

      <p>Driver 1: {stat.formatter(stat.driver1Value)}</p>
      <p>Driver 2: {stat.formatter(stat.driver2Value)}</p>

      {winner && <h2>🏆 Winner: {winner}</h2>}
    </div>
  );
}

export default BattleStats;