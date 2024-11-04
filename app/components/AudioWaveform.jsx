import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "app/components/AudioWaveform.css"; // Assuming styles are moved to a CSS file

export default function AudioWaveform({ audioSrc }) {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [hoverWidth, setHoverWidth] = useState(0);

  // Format time helper function
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
        barWidth: 2,
        waveColor: "#656666",
        progressColor: "#EE772F",
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

  return (
    <div
      id="waveform"
      ref={waveformRef}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <canvas id="wave"></canvas>
      <div id="hover" style={{ width: hoverWidth, opacity: 0.5 }}></div>
      <div id="time" style={{ left: 0, position: "absolute" }}>
        {currentTime}
      </div>
      <div id="duration" style={{ right: 0, position: "absolute" }}>
        {duration}
      </div>
    </div>
  );
}
