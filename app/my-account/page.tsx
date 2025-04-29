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
import Panel from "@/components/ui/Panel";
import Caroussel from "@/components/ui/caroussel";
import Loader from "@/components/ui/loader";

const NB_FIDELITY_POINTS = 10;

export default function MyAccount() {
  const [isOpen, setOpen] = useState(false);
  const [isOpenPanel, setOpenPanel] = useState(false);
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
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }
  return (
    <div className="p-4 relative">
      <div className="bg-gradient-to-r from-blue-200 via-violet-200 via-purple-200 to-teal-100 bg-[length:200%_200%] animate-gradient-x  p-5 mx-8 my-4 rounded-2xl">
        <h1 className="text-xl font-bold mb-4">Mes points</h1>
        {profile && (
          <div className="md:w-3/4 m-auto">
            <div className="bg-white p-4 rounded-xl mb-4 md:w-3/4">
              {/* <div className="my-4">
                points de fidelité :{" "}
                <span className="font-bold">{profile.fidelity_points}</span>
              </div> */}
              <div className="grid grid-cols-5 grid-rows-2 justify-items-center gap-2">
                {Array.from({ length: NB_FIDELITY_POINTS }).map((_, index) => (
                  <div
                    className={`inline-flex justify-center items-center italic rounded-xl border border-2 border-purple-200 w-full h-8`}
                  >
                    {index + 1 === NB_FIDELITY_POINTS &&
                      profile.fidelity_points === NB_FIDELITY_POINTS && (
                        <Image
                          src={popcorn}
                          alt="popcorn"
                          width={24}
                          height={24}
                        />
                      )}
                    {index < profile.fidelity_points &&
                      index + 1 < NB_FIDELITY_POINTS && (
                        <Image
                          src={close.src}
                          alt="close"
                          width={close.width}
                          height={close.height}
                          className="w-4 h-4"
                        />
                      )}
                  </div>
                ))}
              </div>
              {profile.fidelity_points === NB_FIDELITY_POINTS && (
                <div className="flex items-center gap-2 mt-4 text-xs text-neutral-400">
                  <Image src={popcorn} alt="popcorn" width={12} height={12} />
                  <span>: 1 menu de votre choix offert</span>{" "}
                </div>
              )}
              <span className="text-xs text-neutral-400 italic">
                1 case par tranche de 8€ d'achat
              </span>
            </div>

            <h1 className="text-xl font-bold mt-8 mb-4">Nos offres</h1>
            <Caroussel />
            <Panel isOpen={isOpenPanel} onClose={() => setOpenPanel(false)}>
              <Barcode value={profile.loyalty_id} width={2} height={150} />
            </Panel>
          </div>
        )}
      </div>
      <div className="px-4">
        <h1 className="text-xl font-bold mt-8 mb-4">Ma carte</h1>
        <Barcode
          value={profile?.loyalty_id || "0"}
          handleOpenPanel={() => setOpenPanel(true)}
          width={2}
          height={75}
        />
      </div>
      <CallToActionFB isOpen={isOpen} onClose={() => setOpen(false)} />
    </div>
  );
}
