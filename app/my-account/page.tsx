"use client";
import Barcode from "@/components/ui/barCode";
import { useProfile } from "./useProfile";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import CallToActionFB from "@/components/call-to-action-fb";
import Image from "next/image";
import close from "@/assets/close.svg";
import popcorn from "@/assets/popcorn.png";

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
  console.log(close, "close");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mon compte</h1>
      {!isOpen && profile && (
        <div className="md:w-3/4 m-auto">
          <div className="bg-white p-4 rounded-xl mb-4 shadow-lg md:w-3/4">
            <div className="my-4">
              points de fidelité :{" "}
              <span className="font-bold">{profile.fidelity_points}</span>
            </div>
            <div className="grid grid-cols-5 grid-rows-2 justify-items-center gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  className={`inline-flex justify-center items-center italic rounded-xl border border-2 ${index + 1 === 10 ? "border-purple-200" : "border-purple-200"} w-full h-8`}
                >
                  {index < profile.fidelity_points && index + 1 === 10 && (
                    <Image
                      src={popcorn} // Utilisez `close.src` pour obtenir l'URL de l'image
                      alt="popcorn"
                      width={24} // Largeur de l'image
                      height={24} // Hauteur de l'image
                    />
                  )}
                  {index < profile.fidelity_points && index + 1 < 10 && (
                    <Image
                      src={close.src} // Utilisez `close.src` pour obtenir l'URL de l'image
                      alt="close"
                      width={close.width} // Largeur de l'image
                      height={close.height} // Hauteur de l'image
                      className="w-4 h-4"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Barcode value={profile.loyalty_id} />
        </div>
      )}
      <CallToActionFB isOpen={isOpen} onClose={() => setOpen(false)} />
    </div>
  );
}
