"use client";
// import { useEffect, useRef } from "react";
// import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";

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
  // const barcodeRef = useRef<SVGSVGElement | null>(null);

  // useEffect(() => {
  //   if (!value || !barcodeRef.current) return;

  //   try {
  //     // Reset barcode before generating (important to avoid overlaps)
  //     barcodeRef.current.innerHTML = "";

  //     JsBarcode(barcodeRef.current, value, {
  //       format: "CODE128",
  //       lineColor: "#000000",
  //       background: "#ffffff",
  //       width,
  //       height,
  //       displayValue: true,
  //     });
  //   } catch (error) {
  //     console.error("Error generating barcode:", error);
  //   }
  // }, [value]);

  return (
    <div
      onClick={handleOpenPanel}
      className="flex justify-center items-center "
    >
      <QRCodeSVG
        value={value}
        className="my-8 rounded-3xl bg-white border border-2 border-neutral-900 cursor-pointer p-4 w-fit"
        size={width}
        title={value}
      />
    </div>
  );
}
