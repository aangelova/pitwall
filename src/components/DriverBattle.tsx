import { useEffect, useState } from "react";
import TrackBattle from "./TrackBattle";
import DriverVsView from "./DriverVsView";
import type { Driver } from "../types/Driver";
import DriverSelect from "./DriverSelect";

type OpenF1Driver = {
  full_name: string;
  team_name: string;
  driver_number: number;
  headshot_url: string;
};

function DriverBattle() {
  const getTeamColor = (team: string) => {
    if (team.includes("McLaren")) return "#FF8000";
    if (team.includes("Mercedes")) return "#00D2BE";
    if (team.includes("Ferrari")) return "#DC0000";
    if (team.includes("Red Bull")) return "#1E41FF";
    if (team.includes("Williams")) return "#005AFF";
    if (team.includes("Aston Martin")) return "#006F62";
    if (team.includes("Alpine")) return "#FF87BC";
    if (team.includes("Haas")) return "#B6BABD";
    if (team.includes("Sauber")) return "#00E701";
    if (team.includes("Racing Bulls")) return "#6692FF";
    if (team.includes("Cadillac")) return "#B6BABD";
    return "#ffffff";
  };

  const upgradeImageQuality = (url: string | null | undefined, size = "4col") => {
    if (!url) return "";
    return url.replace(/\/1col\//, `/${size}/`);
  };

  type OpenF1Session = {
    session_key: number;
  };

  async function getDrivers(): Promise<OpenF1Driver[]> {
    // 1. Try latest session
    try {
      const response = await fetch("/openf1/drivers?session_key=latest");

      if (response.ok) {
        return await response.json();
      }
    } catch {}

    // 2. Fallback: latest race session of the latest meeting
    const sessions: OpenF1Session[] = await fetch(
      "/openf1/sessions?meeting_key=latest&session_type=Race"
    ).then((r) => r.json());

    if (!sessions.length) {
      throw new Error("No race sessions found.");
    }

    const sessionKey = sessions[sessions.length - 1].session_key;

    const response = await fetch(
      `/openf1/drivers?session_key=${sessionKey}`
    );

    if (!response.ok) {
      throw new Error("Couldn't load drivers.");
    }

    return response.json();
  }

  const fallbackDrivers: Driver[] = [
    {
      name: "Lando NORRIS",
      team: "McLaren",
      number: 1,
      color: "#FF8000",
      image: "",
    },
    {
      name: "Oscar PIASTRI",
      team: "McLaren",
      number: 81,
      color: "#FF8000",
      image: "",
    },
  ];

  const [drivers, setDrivers] = useState<Driver[]>(fallbackDrivers);
  const [driver1, setDriver1] = useState("Lando NORRIS");
  const [driver2, setDriver2] = useState("Oscar PIASTRI");

  const [view, setView] = useState("cards");

  useEffect(() => {
    getDrivers()
      .then((data) => {
        const formattedDrivers: Driver[] = data.map((driver) => ({
          name: driver.full_name,
          team: driver.team_name,
          number: driver.driver_number,
          color: getTeamColor(driver.team_name),
          image: upgradeImageQuality(driver.headshot_url),
        }));

        setDrivers(formattedDrivers);
      })
      .catch((error) => {
        console.error("Failed to load drivers:", error);
      });
  }, []);

  const selectedDriver1 = drivers.find(
    (driver) => driver.name === driver1
  );
  const selectedDriver2 = drivers.find(
    (driver) => driver.name === driver2
  );

  return (
    <section className="driver-battle">
      <h2 className="battle-title">Driver Battle</h2>

      <div className="battle-selector-row">
        <div className="driver-selector-card">
          <span className="selector-label">Driver</span>

          <DriverSelect
            drivers={drivers}
            value={driver1}
            onChange={setDriver1}
          />
        </div>

        <div className="selector-vs">⚔️</div>

        <div className="driver-selector-card">
          <span className="selector-label">Driver</span>

          <DriverSelect
            drivers={drivers}
            value={driver2}
            onChange={setDriver2}
          />
        </div>
      </div>

      <div className="view-switcher">
        <button
          className={view === "cards" ? "active" : ""}
          onClick={() => setView("cards")}
        >
          Driver Cards
        </button>

        <button
          className={view === "track" ? "active" : ""}
          onClick={() => setView("track")}
        >
          Track Battle
        </button>
      </div>
      {view === "cards" && selectedDriver1 && selectedDriver2 && (
        <DriverVsView
          driver1Name={selectedDriver1.name}
          driver2Name={selectedDriver2.name}
          driver1Team={selectedDriver1.team}
          driver2Team={selectedDriver2.team}
          driver1Number={selectedDriver1.number}
          driver2Number={selectedDriver2.number}
          driver1Color={selectedDriver1.color}
          driver2Color={selectedDriver2.color}
          driver1Image={selectedDriver1.image}
          driver2Image={selectedDriver2.image}
        />
      )}

      {view === "track" && (
        <TrackBattle />
      )}

      {/* {selectedDriver1 && selectedDriver2 && (
        <BattleSummary
          driver1Name={selectedDriver1.name}
          driver2Name={selectedDriver2.name}
          driver1Team={selectedDriver1.team}
          driver2Team={selectedDriver2.team}
          driver1Number={selectedDriver1.number}
          driver2Number={selectedDriver2.number}
        />
      )} */}
    </section>
  );
}

export default DriverBattle;