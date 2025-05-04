"use client";

import { useEffect, useState } from "react";
import euro from "@/assets/euro.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import Html5QrcodePlugin from "./html5-qrcode-plugin";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/Panel";

export default function AdminPage() {
  const supabase = createClient();

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

    if (error) {
      console.error("Utilisateur introuvable");
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const detectProfileManually = () => {
    if (loyaltyId) fetchProfile(loyaltyId);
  };

  const handleResetPoints = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ fidelity_points: 0 })
      .eq("id", profile.id);

    if (!error) {
      setProfile(null);
      setPointsToAdd(0);
      setLoyaltyId(null);
    }
  };

  const handleAddPoints = async () => {
    if (!profile) return;

    const newPoints =
      (profile.fidelity_points || 0) + Math.floor(pointsToAdd / 8);

    const res = await supabase
      .from("profiles")
      .update({ fidelity_points: newPoints })
      .eq("id", profile.id);

    if (!res.error) {
      setProfile(null);
      setPointsToAdd(0);
      setLoyaltyId(null);
    }
    console.log(res);
  };

  const onNewScanResult = (decodedText: any, decodedResult: any) => {
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
      <div className="mt-4">
        <p>Inserer un ID</p>
        <input
          className="border border-2"
          type="text"
          value={loyaltyId || ""}
          onChange={(e) => setLoyaltyId(e.target.value)}
        />
        <Button className="ml-4" onClick={detectProfileManually}>
          Recuperer l'id
        </Button>
      </div>
      {profile && (
        <Panel isOpen={!!profile} onClose={() => setProfile(null)}>
          <p>
            <strong>Points actuels :</strong> {profile.fidelity_points || 0}
          </p>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Points à ajouter"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
                className="border p-2 rounded"
              />
              <Image src={euro.src} width={24} height={24} alt={"euro"} />
            </div>

            <button
              onClick={handleAddPoints}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 mr-2"
            >
              ✅ Ajouter des points
            </button>
            <button
              onClick={handleResetPoints}
              className="bg-red-600 text-white px-4 py-2 rounded mt-2"
            >
              Réinitialiser les points
            </button>
          </div>
        </Panel>
      )}
    </div>
  );
}
