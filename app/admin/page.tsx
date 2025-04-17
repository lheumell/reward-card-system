"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import Html5QrcodePlugin from "./html5-qrcode-plugin";

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
      alert(`✅ ${pointsToAdd} point(s) ajouté(s) à ${profile.firstname}`);
      setProfile(null);
      setPointsToAdd(0);
      setLoyaltyId(null);
    }
  };

  const onNewScanResult = (decodedText: any, decodedResult: any) => {
    console.log(decodedText, decodedResult, "jclks");
    fetchProfile(decodedText);
    setLoyaltyId(decodedText);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Scanner une carte fidélité</h1>
      <Html5QrcodePlugin
        fps={10}
        qrbox={500}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        verbose={false}
        qrCodeErrorCallback={undefined}
      />
      {profile && (
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Nom :</strong> {profile.firstname} {profile.lastname}
          </p>
          <p>
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
            <button
              onClick={handleAddPoints}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              ✅ Ajouter des points
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
