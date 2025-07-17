// Codice originale in `page.js`

'use client'

import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Errore nell'accesso alla fotocamera:", err);
        });
    } else {
      // Ferma lo stream se disattivato
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <video ref={videoRef} autoPlay playsInline className="rounded shadow-md w-full max-w-md" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-4">
        <button
          onClick={() => setIsCameraActive(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Avvia fotocamera
        </button>

        <button
          onClick={() => setIsCameraActive(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Ferma fotocamera
        </button>

        <button
          onClick={takePhoto}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Scatta foto
        </button>
      </div>
    </div>
  );
}
