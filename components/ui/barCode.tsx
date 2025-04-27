"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type BarcodeProps = {
  value: string;
  handleOpenPanel?: () => void;
  width: number;
  height: number;
};

export default function BarCode({
  value,
  handleOpenPanel,
  width,
  height,
}: BarcodeProps) {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!value || !barcodeRef.current) return;

    try {
      // Reset barcode before generating (important to avoid overlaps)
      barcodeRef.current.innerHTML = "";

      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        lineColor: "#000000",
        background: "#ffffff",
        width,
        height,
        displayValue: true,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }, [value]);

  return (
    <div
      onClick={handleOpenPanel}
      className="flex justify-center items-center px-2 rounded-xl bg-white shadow-lg"
    >
      <svg className="rounded-md" ref={barcodeRef} />
    </div>
  );
}
