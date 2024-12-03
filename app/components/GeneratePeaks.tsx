import WaveSurfer from "wavesurfer.js";

export async function generatePeaks(fileUrl) {
  const waveSurfer = WaveSurfer.create({
    backend: "MediaElement", // Or 'WebAudio' for finer control
    mediaControls: false,
    container: "",
  });

  waveSurfer.load(fileUrl);

  return new Promise((resolve) => {
    waveSurfer.on("ready", () => {
      const peaks = waveSurfer.backend.getPeaks(512); // Adjust resolution as needed
      resolve(peaks);
      waveSurfer.destroy(); // Clean up
    });
  });
}
