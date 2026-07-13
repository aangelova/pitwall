import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  speed: number;
};

function RacingLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const points: Point[] = [];
    const maxPoints = 35; 

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const currentPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const EASING = 0.22; 
    const OFFSET_X = 6;
    const OFFSET_Y = 10;
    let lastTime = performance.now();
    let animationFrame = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX + OFFSET_X;
      mouse.y = event.clientY + OFFSET_Y;
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mouse.x - currentPos.x;
      const dy = mouse.y - currentPos.y;
      currentPos.x += dx * EASING;
      currentPos.y += dy * EASING;

      const distanceMoved = Math.sqrt(dx * dx + dy * dy);
      const now = performance.now();
      const deltaTime = Math.max(1, now - lastTime);
      const currentSpeed = distanceMoved / deltaTime; 
      lastTime = now;

      points.push({ x: currentPos.x, y: currentPos.y, speed: currentSpeed });
      if (points.length > maxPoints) {
        points.shift();
      }

      for (let index = 1; index < points.length; index += 1) {
        const p1 = points[index - 1];
        const p2 = points[index];

        const progress = index / points.length; 
        

        const speedClamp = Math.min(Math.max(p2.speed / 2, 0), 1); 
        const maxWidth = Math.max(2, 9 * progress);
        const minWidth = Math.max(1, 3 * progress);
        const dynamicWidth = maxWidth - (maxWidth - minWidth) * speedClamp;

        
        context.save();
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);

        context.lineCap = "round";
        context.lineJoin = "round";
        
        context.lineWidth = dynamicWidth * 1.8;
        context.strokeStyle = `rgba(161, 92, 255, ${0.25 * progress})`;
        context.shadowBlur = 20 * progress;
        context.shadowColor = "rgba(161, 92, 255, 1)";
        context.stroke();

        context.lineWidth = dynamicWidth;
        context.strokeStyle = `rgba(210, 180, 255, ${0.9 * progress})`; 
        context.shadowBlur = 0; 
        context.stroke();
        
        context.restore();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="racing-line-canvas" />;
}

export default RacingLine;
