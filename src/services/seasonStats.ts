
export type SeasonDriverStats = {
  driverCode: string;
  points: number;
  wdcPosition: number;
  wins: number;
  pointsPerRace: number;
  pointsBehindLeader: number;
  winRate: number;
  podiums: number;
  top5Finishes: number;
  top10Finishes: number;
  dnf: number;
  dns: number;
  dsq: number;
  dnfRate: number;
  finishRate: number;
  classifiedFinishes: number;
};


const STANDINGS_URL = "/f1api/api/current/drivers-championship";
const JOLPICA_BASE = "/jolpica";

const normalize = (value: string) =>
  value.toLowerCase().replaceAll(" ", "").replaceAll("-", "");

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
  return response.json();
};


interface JolpicaResult {
  position: string;
  status: string; 
  Driver: { driverId: string };
}

interface DriverOutcomes {
  podiums: number;
  top5Finishes: number;
  top10Finishes: number;
  dnf: number;
  dns: number;
  dsq: number;
  dnfRate: number;
  finishRate: number;
  classifiedFinishes: number;
}

//Cache

let outcomeCache: Map<string, DriverOutcomes> | null = null;
let outcomeCacheYear: number | null = null;
let outcomeFetchPromise: Promise<Map<string, DriverOutcomes>> | null = null;


function isClassified(result: JolpicaResult): boolean {
  return result.status === "Finished" || result.status === "Lapped";
}

function isDNF(result: JolpicaResult): boolean {
  return result.status === "Retired";
}

function isDNS(result: JolpicaResult): boolean {
  return result.status === "Did not start" || result.status === "Did not qualify";
}

function isDSQ(result: JolpicaResult): boolean {
  return result.status === "Disqualified";
}

//Core fetcher 

async function fetchAllOutcomes(year: number): Promise<Map<string, DriverOutcomes>> {
  if (outcomeCache && outcomeCacheYear === year) return outcomeCache;
  if (outcomeFetchPromise) return outcomeFetchPromise;

  outcomeFetchPromise = (async () => {
    //get total race count for the season so far (the actual last completed round)
    const lastRaceData = await fetchJson(`${JOLPICA_BASE}/current/last/results.json`);
    const lastRound = Number(
      lastRaceData.MRData?.RaceTable?.Races?.[0]?.round ?? 0
    );

    if (lastRound === 0) return new Map();

    //fetch all rounds in parallel
    const rounds = Array.from({ length: lastRound }, (_, i) => i + 1);
    const allRaceData = await Promise.all(
      rounds.map((round) =>
        fetchJson(`${JOLPICA_BASE}/${year}/${round}/results.json?limit=30`).catch(
          () => null
        )
      )
    );

    //group by driverId
    const byDriver = new Map<string, JolpicaResult[]>();

    for (const raceData of allRaceData) {
      if (!raceData) continue;
      const results: JolpicaResult[] =
        raceData.MRData?.RaceTable?.Races?.[0]?.Results ?? [];
      for (const r of results) {
        const id = r.Driver.driverId;
        if (!byDriver.has(id)) byDriver.set(id, []);
        byDriver.get(id)!.push(r);
      }
    }

    //aggregate
    const map = new Map<string, DriverOutcomes>();

    for (const [driverId, results] of byDriver.entries()) {
      const dnf = results.filter(isDNF).length;
      const dns = results.filter(isDNS).length;
      const dsq = results.filter(isDSQ).length;
      const classified = results.filter(isClassified);
      const classifiedFinishes = classified.length;
      const podiums = classified.filter((r) => Number(r.position) <= 3).length;
      const top5Finishes = classified.filter((r) => Number(r.position) <= 5).length;
      const top10Finishes = classified.filter((r) => Number(r.position) <= 10).length;
      const started = results.length - dns;
      const dnfRate = started > 0 ? dnf / started : 0;
      const finishRate = started > 0 ? classifiedFinishes / started : 0;

      map.set(normalize(driverId), {
        podiums,
        top5Finishes,
        top10Finishes,
        dnf,
        dns,
        dsq,
        dnfRate,
        finishRate,
        classifiedFinishes,
      });
    }

    outcomeCache = map;
    outcomeCacheYear = year;
    outcomeFetchPromise = null;
    return map;
  })();

  return outcomeFetchPromise;
}

//  Public API

export async function getSeasonDriverStats(
  driverName: string
): Promise<SeasonDriverStats> {
  const year = new Date().getFullYear();
  const normalizedName = normalize(driverName);

  const [data, outcomesMap] = await Promise.all([
    fetchJson(`${STANDINGS_URL}?limit=100&offset=0`),
    fetchAllOutcomes(year),
  ]);

  // championship standing
  const standings = data.drivers_championship ?? [];

  const driverStanding = standings.find((s: any) => {
    const fullName = normalize(`${s.driver.name} ${s.driver.surname}`);
    const surname = normalize(s.driver.surname ?? "");
    const driverId = normalize(s.driverId ?? "");
    return (
      fullName === normalizedName ||
      fullName.includes(normalizedName) ||
      normalizedName.includes(fullName) ||
      normalizedName.endsWith(surname) ||
      driverId === normalizedName
    );
  });

  const leaderPoints = Number(standings[0]?.points ?? 0);
  const points = Number(driverStanding?.points ?? 0);
  const wins = Number(driverStanding?.wins ?? 0);
  const racesCompleted = Number(standings[0]?.races ?? 0) || 7;

  // ── outcome lookup ──
  const surname = normalize(driverName.split(" ").at(-1) ?? "");
  const driverId = normalize(driverStanding?.driverId ?? "");
  let outcomes: DriverOutcomes | undefined;

  if (driverId && outcomesMap.has(driverId)) {
    outcomes = outcomesMap.get(driverId);
  } else {
    for (const [key, val] of outcomesMap.entries()) {
      if (
        key === normalizedName ||
        key.includes(normalizedName) ||
        normalizedName.includes(key) ||
        key.endsWith(surname)
      ) {
        outcomes = val;
        break;
      }
    }
  }

  return {
    driverCode: driverStanding?.driver.shortName ?? "",
    points,
    wdcPosition: Number(driverStanding?.position ?? 0),
    wins,
    pointsPerRace: racesCompleted > 0 ? points / racesCompleted : 0,
    pointsBehindLeader: leaderPoints - points,
    winRate: racesCompleted > 0 ? (wins / racesCompleted) * 100 : 0,
    podiums: outcomes?.podiums ?? 0,
    top5Finishes: outcomes?.top5Finishes ?? 0,
    top10Finishes: outcomes?.top10Finishes ?? 0,
    dnf: outcomes?.dnf ?? 0,
    dns: outcomes?.dns ?? 0,
    dsq: outcomes?.dsq ?? 0,
    dnfRate: outcomes?.dnfRate ?? 0,
    finishRate: outcomes?.finishRate ?? 1,
    classifiedFinishes: outcomes?.classifiedFinishes ?? 0,
  };
}