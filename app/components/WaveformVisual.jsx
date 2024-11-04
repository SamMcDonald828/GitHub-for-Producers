import React, { useEffect, useRef, useState } from "react";

export default function WaveformVisual({ audioSrc }) {
  const canvasRef = useRef(null); // For canvas drawing
  const audioRef = useRef(null); // For the <audio> element
  const audioContextRef = useRef(null); // For the AudioContext
  const [isPlaying, setIsPlaying] = useState(false);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  };

  const startVisualization = () => {
    if (!audioSrc || !audioContextRef.current) return;

    fetch(audioSrc)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        audioContextRef.current.decodeAudioData(arrayBuffer),
      )
      .then((audioBuffer) => visualize(audioBuffer))
      .catch((error) => console.error("Error decoding audio data:", error));
  };

  useEffect(() => {
    initializeAudioContext();

    // Clean up on component unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startVisualization();
    }
  }, [isPlaying, audioSrc]);

  const visualize = (audioBuffer) => {
    const filteredData = filterData(audioBuffer);
    const normalizedData = normalizeData(filteredData);
    draw(normalizedData);
  };

  const filterData = (audioBuffer) => {
    const rawData = audioBuffer.getChannelData(0);
    const samples = 70;
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }
      filteredData.push(sum / blockSize);
    }
    return filteredData;
  };

  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map((n) => n * multiplier);
  };

  const draw = (normalizedData) => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const padding = 20;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.translate(0, canvas.offsetHeight / 2 + padding);

    const width = canvas.offsetWidth / normalizedData.length;
    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      let height = normalizedData[i] * canvas.offsetHeight - padding;
      if (height < 0) height = 0;
      else if (height > canvas.offsetHeight / 2)
        height = canvas.offsetHeight / 2;
      drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    }
  };

  const drawLineSegment = (ctx, x, y, width, isEven) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    y = isEven ? y : -y;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, y);
    ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  };

  const handlePlay = () => {
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "240px", height: "40px" }}
      ></canvas>
      <audio
        ref={audioRef}
        src={audioSrc}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
      ></audio>
    </div>
  );
}
