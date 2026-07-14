import type {
  CreatorDriver,
} from "../data/creatorRankingData";

type Props = {
  driver: CreatorDriver;
  canFlip: boolean;
};

function getDriverImageClass(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("george")) {
    return "george-image";
  }

  if (normalizedName.includes("lando")) {
    return "lando-image";
  }

  if (normalizedName.includes("charles")) {
    return "charles-image";
  }

  if (normalizedName.includes("oscar")) {
    return "oscar-image";
  }

  return "";
}

function CreatorCard({ driver, canFlip, }: Props) {
  const imageClass = getDriverImageClass(
    driver.name
  );

  return (
    <article
      className={`creator-card ${
        canFlip ? "can-flip" : ""
      }`}
    >
      <div className="creator-card-inner">
        <div className="creator-card-front">
          <img
            src={driver.image}
            alt={driver.name}
            className={`creator-image ${imageClass}`}
          />

          <div className="creator-front-info">
            <h2>{driver.name}</h2>
            <p>{driver.title}</p>
          </div>
        </div>

        <div className="creator-card-back">
          <h3>Telemetry Report</h3>

          <div className="creator-stats">
            {driver.stats.map((stat) => (
              <div
                key={stat.label}
                className="creator-stat"
              >
                <div className="creator-stat-top">
                  <span>
                    {stat.emoji} {stat.label}
                  </span>

                  <span>{stat.value}</span>
                </div>

                <div className="creator-bar">
                  <div
                    className="creator-bar-fill"
                    style={{
                      width: `${Math.min(
                        stat.value,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="creator-stat">
              <div className="creator-stat-top">
                <span>📈 Bias Index</span>
                <span>{driver.biasIndex}%</span>
              </div>

              <div className="creator-bar">
                <div
                  className="creator-bar-fill"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CreatorCard;