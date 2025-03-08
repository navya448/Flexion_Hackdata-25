import { useRef, useEffect } from "react";

const Stickman = ({ postureAngle }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawStickman(angle) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const slouchFactor = Math.sin((angle * Math.PI) / 180) * 15; // Convert angle to radians

      ctx.strokeStyle = angle > 10 ? "red" : "green"; // Turns red if slouching
      ctx.lineWidth = 4;

      ctx.beginPath();

      // Head
      ctx.arc(centerX, centerY - 80, 20, 0, Math.PI * 2);

      // Body (rotates based on slouch angle)
      ctx.moveTo(centerX, centerY - 60);
      ctx.lineTo(centerX + slouchFactor, centerY);

      // Arms
      ctx.moveTo(centerX - 40, centerY - 40);
      ctx.lineTo(centerX + 40, centerY - 40);

      // Legs
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX - 20, centerY + 40);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + 20, centerY + 40);

      ctx.stroke();
    }

    drawStickman(postureAngle);
  }, [postureAngle]); // Re-draw when postureAngle changes

  return <canvas ref={canvasRef} width={300} height={300} />;
};

export default Stickman;
