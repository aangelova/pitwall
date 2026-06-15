import { useEffect, useState } from "react";
import DriverCard from "./DriverCard";

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
      <div className="driver-cards">
        {selectedDriver1 && (
          <DriverCard
            name={selectedDriver1.name}
            team={selectedDriver1.team}
            number={selectedDriver1.number}
            color={selectedDriver1.color}
            image={selectedDriver1.image}
          />
        )}
        {selectedDriver2 && (
          <DriverCard
            name={selectedDriver2.name}
            team={selectedDriver2.team}
            number={selectedDriver2.number}
            color={selectedDriver2.color}
            image={selectedDriver2.image}
          />
        )}
      </div>
    </section>
  );
}

export default DriverBattle;