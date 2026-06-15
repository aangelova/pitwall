type BattleSummaryProps = {
  driver1Name: string;
  driver2Name: string;
  driver1Team: string;
  driver2Team: string;
  driver1Number: number;
  driver2Number: number;
};

function BattleSummary({
  driver1Name,
  driver2Name,
  driver1Team,
  driver2Team,
  driver1Number,
  driver2Number,
}: BattleSummaryProps) {
  const sameTeam = driver1Team === driver2Team;
  const numberDifference = Math.abs(driver1Number - driver2Number);

  return (
    <div className="battle-summary">
      <h3>Battle Summary</h3>

      <p>
        {driver1Name} vs {driver2Name}
      </p>

      <p>
        Teams: {sameTeam ? "Same team battle" : "Different teams"}
      </p>

      <p>
        Number gap: {numberDifference}
      </p>
    </div>
  );
}

export default BattleSummary;