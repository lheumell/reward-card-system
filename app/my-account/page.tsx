"use client";
import Barcode from "@/components/ui/barCode";
import { useProfile } from "./useProfile";

export default function MyAccount() {
  const profile = useProfile();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mon compte</h1>
      {profile ? (
        <>
          <Barcode value={profile.loyalty_id} />
          <div>points : {profile.points}</div>
        </>
      ) : (
        <p>Chargement du code de fidélité...</p>
      )}
    </div>
  );
}
