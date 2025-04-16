"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const supabase = createClient();
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [loyaltyId, setLoyaltyId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [pointsToAdd, setPointsToAdd] = useState(0);

  useEffect(() => {
    const canVisitPage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/sign-in");
      }
    };
    canVisitPage();
  }, []);

  // 🎥 Démarre le scanner une seule fois
  useEffect(() => {
    if (!scannerRef.current) return;

    html5QrCodeRef.current = new Html5Qrcode("qr-reader");
    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length > 0) {
        html5QrCodeRef.current?.start(
          { facingMode: "environment" },
          {
            fps: 100,
            qrbox: { width: 750, height: 750 },
          },
          async (decodedText) => {
            console.log(decodedText, "devices");
            if (decodedText && decodedText !== loyaltyId) {
              setLoyaltyId(decodedText);
              await fetchProfile(decodedText);
              html5QrCodeRef.current?.stop();
            }
          },
          (errorMessage) => {
            // Erreur de scan (souvent bruit, pas grave)
            console.warn("Erreur de scan :", errorMessage);
          }
        );
      }
    });

    return () => {
      html5QrCodeRef.current?.stop().then(() => {
        html5QrCodeRef.current?.clear();
      });
    };
  }, []);

  // 🔍 Récupère le profil utilisateur
  const fetchProfile = async (scannedLoyaltyId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("loyalty_id", scannedLoyaltyId)
      .single();

    console.log(data, "data");

    if (error) {
      console.error("Utilisateur introuvable");
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const handleAddPoints = async () => {
    if (!profile) return;

    const newPoints = (profile.fidelity_points || 0) + pointsToAdd;

    const { error } = await supabase
      .from("profiles")
      .update({ fidelity_points: newPoints })
      .eq("id", profile.id);

    if (!error) {
      setProfile(null);
      setPointsToAdd(0);
      setLoyaltyId(null);

      // Redémarre le scan
      html5QrCodeRef.current?.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 750, height: 750 } },
        async (decodedText) => {
          if (decodedText && decodedText !== loyaltyId) {
            setLoyaltyId(decodedText);
            await fetchProfile(decodedText);
            html5QrCodeRef.current?.stop();
          }
        },
        (errorMessage) => {
          // Handle QR code error
          console.warn("QR Code Error:", errorMessage);
        }
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">📷 Scanner une carte fidélité</h1>

      {!profile && <div id="qr-reader" ref={scannerRef} className="mb-4" />}

      {profile && (
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-black">
            <strong>Points actuels :</strong> {profile.fidelity_points || 0}
          </p>

          <div className="mt-4">
            <input
              type="number"
              placeholder="Points à ajouter"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <Button onClick={handleAddPoints} variant={"outline"}>
              Ajouter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
