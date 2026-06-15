import { useEffect, useState } from "react";
import TrackBattle from "./TrackBattle";
import DriverVsView from "./DriverVsView";

type Driver = {
  name: string;
  team: string;
  number: number;
  color: string;
  image: string;
};

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
    fetch("https://api.openf1.org/v1/drivers?session_key=latest")
      .then((response) => response.json())
      .then((data: OpenF1Driver[]) => {
        const formattedDrivers: Driver[] = data.map((driver) => ({
          name: driver.full_name,
          team: driver.team_name,
          number: driver.driver_number,
          color: getTeamColor(driver.team_name),
          image: upgradeImageQuality(driver.headshot_url),
        }));
        setDrivers(formattedDrivers);
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
      <h2>Driver Battle</h2>
      <div className="view-switcher">
        <button
          onClick={() => setView("cards")}
        >
          Driver Cards
        </button>

        <button
          onClick={() => setView("track")}
        >
          Track Battle
        </button>
      </div>
      <div className="battle-selectors">
        <div>
          <h3>Driver 1</h3>
          <select
            value={driver1}
            onChange={(event) => setDriver1(event.target.value)}
          >
            {drivers.map((driver) => (
              <option key={driver.number} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Driver 2</h3>
          <select
            value={driver2}
            onChange={(event) => setDriver2(event.target.value)}
          >
            {drivers.map((driver) => (
              <option key={driver.number} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h3>
        {driver1} ⚔️ {driver2}
      </h3>
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