export type SeasonDriverStats = {
  driverCode: string;
  points: number;
  wdcPosition: number;
  wins: number;
  pointsPerRace: number;
  pointsBehindLeader: number;
  winRate: number;
};

const BASE_URL = "/f1api/api/current/drivers-championship";

const normalize = (value: string) =>
  value.toLowerCase().replaceAll(" ", "").replaceAll("-", "");

const fetchJson = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch season standings");
  }

  return response.json();
};

export async function getSeasonDriverStats(
  driverName: string
): Promise<SeasonDriverStats> {
  const normalizedName = normalize(driverName);

  const data = await fetchJson(`${BASE_URL}?limit=100&offset=0`);
  const standings = data.drivers_championship ?? [];

  const driverStanding = standings.find((standing: any) => {
    const fullName = normalize(
      `${standing.driver.name} ${standing.driver.surname}`
    );

    const surname = normalize(standing.driver.surname ?? "");

    return (
      fullName === normalizedName ||
      fullName.includes(normalizedName) ||
      normalizedName.includes(fullName) ||
      normalizedName.endsWith(surname)
    );
  });

  const leaderPoints = Number(standings[0]?.points ?? 0);
  const points = Number(driverStanding?.points ?? 0);
  const wins = Number(driverStanding?.wins ?? 0);

  const racesCompleted = 7;

  return {
    driverCode: driverStanding?.driver.shortName ?? "",
    points,
    wdcPosition: Number(driverStanding?.position ?? 0),
    wins,
    pointsPerRace: points / racesCompleted,
    pointsBehindLeader: leaderPoints - points,
    winRate: (wins / racesCompleted) * 100,
  };
}