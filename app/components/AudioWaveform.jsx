import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

// eslint-disable-next-line react/prop-types
export default function AudioWaveform({ audioSrc, peaks }) {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  // const togglePlayPause = () => {
  //   setIsPlaying((prevState) => (prevState === "play" ? "pause" : "play"));
  //   waveSurferRef.current.playPause();
  // };
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
        progressColor: "#b04c47",
        url: audioSrc,
        peaks: [
          [
            0, 0.0023595101665705442, 0.012107174843549728,
            0.005919494666159153, -0.31324470043182373, 0.1511787623167038,
            0.2473851442337036, 0.11443428695201874, -0.036057762801647186,
            -0.0968964695930481, -0.03033737652003765, 0.10682467371225357,
            0.23974689841270447, 0.013210971839725971, -0.12377244979143143,
            0.046145666390657425, -0.015757400542497635, 0.10884027928113937,
            0.06681904196739197, 0.09432944655418396, -0.17105795443058014,
            -0.023439358919858932, -0.10380347073078156, 0.0034454423002898693,
            0.08061369508504868, 0.026129156351089478, 0.18730352818965912,
            0.020447958260774612, -0.15030759572982788, 0.05689578503370285,
            -0.0009095853311009705, 0.2749626338481903, 0.2565386891365051,
            0.07571295648813248, 0.10791446268558502, -0.06575305759906769,
            0.15336275100708008, 0.07056761533021927, 0.03287476301193237,
            -0.09044631570577621, 0.01777501218020916, -0.04906218498945236,
            -0.04756792634725571, -0.006875281687825918, 0.04520256072282791,
            -0.02362387254834175, -0.0668797641992569, 0.12266506254673004,
            -0.10895221680402756, 0.03791835159063339, -0.0195105392485857,
            -0.031097881495952606, 0.04252675920724869, -0.09187793731689453,
            0.0829525887966156, -0.003812957089394331, 0.0431736595928669,
            0.07634212076663971, -0.05335947126150131, 0.0345163568854332,
            -0.049201950430870056, 0.02300390601158142, 0.007677287794649601,
            0.015354577451944351, 0.007677287794649601, 0.007677288725972176,
          ],
        ],
        interact: true,
        preload: true,
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
  }, [audioSrc, peaks]);

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
    <>
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
      {/* <button className="z-12" onClick={togglePlayPause}>
        {isPlaying}
      </button> */}
    </>
  );
}
