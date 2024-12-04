import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function GeneratePeaks({ file }: { file: any }) {
  const [peaks, setPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: "#waveform",
      backend: "MediaElement",
    });

    waveSurfer.load(file.remoteUrl);

    waveSurfer.on("ready", () => {
      const generatedPeaks = waveSurfer.backend.getPeaks(512);
      setPeaks(generatedPeaks);

      // Optionally send peaks back to the server
      fetch(`/api/update-file-peaks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id, peaks: generatedPeaks }),
      });

      waveSurfer.destroy();
    });
  }, [file.id, file.remoteUrl]);

  return (
    <div>
      <div id="waveform"></div>
    </div>
  );
}
