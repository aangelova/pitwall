type HeatWarningProps = {
  warning: string;
  onContinue: () => void;
};

function HeatWarning({
  warning,
  onContinue,
}: HeatWarningProps) {
  return (
    <div className="warning-screen">

      <div className="warning-box">

        <div className="warning-icon">🌡️</div>

        <h1>Temperature</h1>

        <p>{warning}</p>

        <button
          className="continue-btn"
          onClick={onContinue}
        >
          Proceed at your own risk
        </button>

      </div>

    </div>
  );
}

export default HeatWarning;