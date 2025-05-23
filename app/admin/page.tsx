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

  const onNewScanResult = (text: string) => {
    fetchProfile(text);
    setLoyaltyId(text);
  };

  return (
    <div className="h-screen">
      <Html5QrcodePlugin onSuccess={onNewScanResult} />
      {/* <div className="mt-4">
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
      </div> */}
      {profile && (
        <Panel isOpen={!!profile} onClose={() => setProfile(null)}>
          <h2 className="text-lg">Combien le client a payé ? </h2>
          {/* <p>
            <strong>Points actuels :</strong> {profile.fidelity_points || 0}
          </p> */}

          <div className="mt-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <span
                className="bold border-2 bg-white cursor-pointer rounded-full px-2"
                onClick={() =>
                  setPointsToAdd((prev) => (prev > 0 ? prev - 1 : prev))
                }
              >
                -
              </span>
              <input
                style={{
                  width: "200px",
                  border: "1px solid black",
                  borderRadius: "12px",
                  padding: "4px",
                  textAlign: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  backgroundColor: "white",
                  color: "#e3bb19",
                  // background: `url(${euro.src}) no-repeat right`,
                }}
                type="number"
                // placeholder="Points à ajouter"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
                className="border p-2 rounded border p-2 rounded bg-red-600"
              />
              <span
                className="bold border-2 bg-white cursor-pointer rounded-full px-2"
                onClick={() => setPointsToAdd((prev) => prev + 1)}
              >
                +
              </span>
            </div>
            {/* <p className="text-center mt-2">EURO</p> */}
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleAddPoints}
                className="w-[150px] border border-green-900 bg-white text-green-900 px-4 py-2 rounded-lg mt-2"
              >
                Ajouter
              </button>{" "}
              <button
                onClick={handleResetPoints}
                className=" underline text-red-900 px-4 rounded-lg mt-1"
              >
                Réinitialiser les points
              </button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
