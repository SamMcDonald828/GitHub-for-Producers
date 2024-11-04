import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioWaveform({ audioSrc }) {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [hoverWidth, setHoverWidth] = useState(0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  useEffect(() => {
    if (!waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        barWidth: 2.5,
        waveColor: "#656666",
        progressColor: "#a70000",
        url: audioSrc,
        interact: true,
        cursorWidth: 0,
      });

      waveSurferRef.current.on("decode", (duration) => {
        setDuration(formatTime(duration));
      });

      waveSurferRef.current.on("timeupdate", (currentTime) => {
        setCurrentTime(formatTime(currentTime));
      });

      waveSurferRef.current.on("interaction", () => {
        waveSurferRef.current.playPause();
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, [audioSrc]);

  const handleMouseMove = (e) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      setHoverWidth(offsetX);
    }
  };

  // Inline styles for the waveform and elements
  const waveformStyle = {
    position: "relative",
    cursor: "pointer",
  };

  const hoverStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
    pointerEvents: "none",
    height: "100%",
    width: hoverWidth,
    mixBlendMode: "overlay",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    opacity: 0.5,
    transition: "opacity 0.2s ease",
  };

  const timeStyle = {
    position: "absolute",
    zIndex: 11,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "11px",
    background: "rgba(0, 0, 0, 0.75)",
    padding: "2px",
    color: "#ddd",
  };

  const durationStyle = {
    ...timeStyle,
    right: 0,
  };

  return (
    <div
      id="waveform"
      ref={waveformRef}
      onMouseMove={handleMouseMove}
      style={waveformStyle}
    >
      <div id="hover" style={hoverStyle}>
        <canvas id="wave"></canvas>
      </div>
      <div id="time" style={{ ...timeStyle, left: 0 }}>
        {currentTime}
      </div>
      <div id="duration" style={durationStyle}>
        {duration}
      </div>
    </div>
  );
}
