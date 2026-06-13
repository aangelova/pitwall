type DriverCardProps = {
  name: string;
  team: string;
  number: number;
  color: string;
  image: string;
};

function DriverCard({
  name,
  team,
  number,
  color,
  image,
}: DriverCardProps) {
  return (
    <div className="driver-card" style={{ borderColor: color,}} >
      <img
        src={image}
        alt={name}
        className="driver-image"
      />
      <h3 style={{ color: color }}>{name}</h3>

      <p>Team: {team}</p>

      <p>#{number}</p>
    </div>
  );
}

export default DriverCard;