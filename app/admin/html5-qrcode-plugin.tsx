import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScannerCustom = ({
  onSuccess,
}: {
  onSuccess: (text: string) => void;
}) => {
  const qrRegionId = "qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const start = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length === 0) throw new Error("Pas de caméra");

        const cameraId = devices[0].id;
        const scanner = new Html5Qrcode(qrRegionId);
        scannerRef.current = scanner;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            // qrbox: { width: 250, height: 250 }, // carré de scan,
            videoConstraints: {
              facingMode: "environment", // caméra arrière
              width: { ideal: window.innerWidth },
              height: { ideal: window.innerHeight },
            },
          },
          (decodedText) => {
            onSuccess(decodedText);
          },
          (err) => {
            // Tu peux afficher les erreurs ici si tu veux
          }
        );
      } catch (e) {
        console.error("Erreur QR:", e);
      }
    };

    start();

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current?.clear();
      });
    };
  }, []);

  return (
    <div>
      <div id={qrRegionId} style={{ width: "100vw", height: "100vh" }} />

      {/* 🎯 Overlay custom */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 250,
          height: 250,
          transform: "translate(-50%, -50%)",
          border: "2px solid black",
          borderRadius: "12px",
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
};

export default QrScannerCustom;
