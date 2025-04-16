"use client";
import Barcode from "@/components/ui/barCode";
import { useProfile } from "./useProfile";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function MyAccount() {
  const profile = useProfile();
  const supabase = createClient();

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mon compte</h1>
      {profile ? (
        <>
          <div className="mb-4">
            points de fidelité :{" "}
            <span className="font-bold">{profile.fidelity_points}</span>
          </div>
          <Barcode value={profile.loyalty_id} />
        </>
      ) : (
        <p>Chargement du code de fidélité...</p>
      )}
    </div>
  );
}
