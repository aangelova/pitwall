import { useRef } from "react";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {

  const cardRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale(1.03)
    `;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  }

  function handleLeave() {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      ref={cardRef}
      className="card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="card-glow" />

      <span>{icon}</span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

export default FeatureCard;