"use client";
import Barcode from "@/components/ui/barCode";
import { useProfile } from "./useProfile";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import CallToActionFB from "@/components/call-to-action-fb";

export default function MyAccount() {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const supabase = createClient();
  const profile = useProfile();

  useEffect(() => {
    const getIsFollowFbPage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("is_follow_fb_page")
        .eq("id", user.id)
        .single();

      const isFollowFbPage = data?.is_follow_fb_page ?? null;
      if (!isFollowFbPage) {
        setOpen(true);
        setLoading(false);
      } else {
        setOpen(false);
        setLoading(false);
      }
    };
    getIsFollowFbPage();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">En cours de chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mon compte</h1>
      {!isOpen && profile && (
        <>
          <div className="mb-4">
            points de fidelité :{" "}
            <span className="font-bold">{profile.fidelity_points}</span>
          </div>
          <Barcode value={profile.loyalty_id} />
        </>
      )}
      <CallToActionFB isOpen={isOpen} onClose={() => setOpen(false)} />
    </div>
  );
}
