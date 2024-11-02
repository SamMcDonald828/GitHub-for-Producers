import React, { useEffect, useRef } from "react";
import * as Tone from "tone";

interface WaveformVisualizerProps {
  audioSrc: string | undefined;
}

const WaveformVisual: React.FC<WaveformVisualizerProps> = ({ audioSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyser = useRef<Tone.Analyser | null>(null);
  const player = useRef<Tone.Player | null>(null);

  useEffect(() => {
    if (!audioSrc) return;

    // Create Tone.js Player and Analyser
    player.current = new Tone.Player(audioSrc).toDestination();

    // Create analyser with correct type
    analyser.current = new Tone.Analyser("wave" as Tone.AnalyserType); // Cast to Tone.AnalyserType

    // Connect Player to Analyser
    player.current.connect(analyser.current);

    // Start playing the audio
    Tone.start().then(() => {
      player.current?.start();
    });

    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    const draw = () => {
      if (!analyser.current || !canvasCtx) return;

      requestAnimationFrame(draw);

      // Retrieve the waveform data
      const dataArray = analyser.current.getValue() as Float32Array;
      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, canvas!.width, canvas!.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.beginPath();

      const sliceWidth = canvas!.width / dataArray.length;
      let x = 0;

      // Loop through the dataArray and draw the waveform
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i]; // No need to divide by 128.0 since we're using a normalized Float32Array
        const y = (v * canvas!.height) / 2 + canvas!.height / 2; // Center the waveform vertically

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas!.width, canvas!.height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      // Clean up: stop the player when the component unmounts
      player.current?.stop();
      player.current?.dispose();
      analyser.current?.dispose();
    };
  }, [audioSrc]);

  return <canvas ref={canvasRef} width={600} height={200} />;
};

export default WaveformVisual;
