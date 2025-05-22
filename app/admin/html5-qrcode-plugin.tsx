// QrScanner.tsx
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

type Props = {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
};

const QrScanner = ({ onScanSuccess, onScanError }: Props) => {
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error("Aucune caméra détectée");
        }

        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back")
        );

        const cameraId = backCamera?.id || devices[0].id;

        const qrCodeScanner = new Html5Qrcode(qrCodeRegionId);
        html5QrCodeRef.current = qrCodeScanner;

        await qrCodeScanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            if (onScanError) onScanError(errorMessage);
          }
        );
      } catch (err) {
        console.error("Erreur initialisation caméra :", err);
      }
    };

    startScanner();

    return () => {
      html5QrCodeRef.current
        ?.stop()
        .then(() => html5QrCodeRef.current?.clear())
        .catch((err) => console.error("Erreur arrêt du scanner :", err));
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id={qrCodeRegionId} style={{ width: "100%", height: "100%" }} />

      {/* Coin haut gauche */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 30,
          height: 30,
          borderTop: "4px solid #00FF00",
          borderLeft: "4px solid #00FF00",
          // borderTopLeftRadius: 5,
        }}
      />

      {/* Coin haut droit */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 30,
          height: 30,
          borderTop: "4px solid #00FF00",
          borderRight: "4px solid #00FF00",
          // borderTopRightRadius: 5,
        }}
      />

      {/* Coin bas gauche */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 30,
          height: 30,
          borderBottom: "4px solid #00FF00",
          borderLeft: "4px solid #00FF00",
          // borderBottomLeftRadius: 5,
        }}
      />

      {/* Coin bas droit */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 30,
          height: 30,
          borderBottom: "4px solid #00FF00",
          borderRight: "4px solid #00FF00",
          // borderBottomRightRadius: 5,
        }}
      />
    </div>
  );
};

export default QrScanner;
