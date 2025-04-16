"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type BarcodeProps = {
  value: string;
};

export default function BarCode({ value }: BarcodeProps) {
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
        width: 2,
        height: 60,
        displayValue: true,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }, [value]);

  return (
    <div className="flex justify-center items-center border-2 border-gray-100 p-2 rounded-lg">
      <svg className="rounded-md" ref={barcodeRef} />
    </div>
  );
}
