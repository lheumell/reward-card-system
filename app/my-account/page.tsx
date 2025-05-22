"use client";
import Barcode from "@/components/ui/barCode";
import { useEffect, useState } from "react";
import CallToActionFB from "@/components/call-to-action-fb";
import Image from "next/image";
import close from "@/assets/close.svg";
import logo from "@/assets/chcamion_logo.svg";
import popcorn from "@/assets/popcorn.png";
import Panel from "@/components/ui/Panel";
import Caroussel from "@/components/ui/caroussel";
import Loader from "@/components/ui/loader";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/utils/supabase/client";

const NB_FIDELITY_POINTS = 10;

type TProfile = {
  id: string;
  loyalty_id: string;
  user_id: string;
  fidelity_points: number;
  is_follow_fb_page: boolean;
};

export default function MyAccount() {
  const [isOpen, setOpen] = useState(false);
  const [isOpenPanel, setOpenPanel] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/sign-in"; // Redirection côté client
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const getIsFollowFbPage = async () => {
      if (!profile) return;
      const isFollowFbPage = profile.is_follow_fb_page ?? null;
      if (!isFollowFbPage) {
        setOpen(true);
        setLoading(false);
      } else {
        setOpen(false);
        setLoading(false);
      }
    };
    getIsFollowFbPage();
  }, [profile]);

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
                    key={index}
                    className={`inline-flex justify-center items-center italic rounded-xl border border-2 border-purple-200 w-full h-8`}
                  >
                    {index + 1 === NB_FIDELITY_POINTS &&
                      profile.fidelity_points >= NB_FIDELITY_POINTS && (
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
              <Barcode
                value={profile?.loyalty_id || "0"}
                handleOpenPanel={() => setOpenPanel(true)}
                width={350}
                height={60}
              />
            </Panel>
          </div>
        )}
      </div>
      <div className="px-4">
        <h1 className="text-xl font-bold mt-8 mb-4">Ma carte</h1>
        {/* <Barcode
          value={profile?.loyalty_id || "0"}
          handleOpenPanel={() => setOpenPanel(true)}
          width={250}
          height={60}
        /> */}
        <div
          onClick={() => setOpenPanel(true)}
          className="relative bg-gradient-to-r from-violet-200 from-5% via-violet-50 via-50% to-95% to-teal-100  animate-gradient-x rounded-xl bg-green-100 shadow-xl border border-2 border-neutral-200 cursor-pointer mt-8 flex flex-col items-center p-4"
        >
          <div className="grid grid-cols-3 gap-4 w-full">
            <div>
              <span className="font-bold text-lg text-neutral-900">
                Ch'camion
              </span>
            </div>

            <QRCodeSVG
              className="p-2 bg-white rounded-xl col-start-3"
              value={profile?.loyalty_id || "0"}
              size={100}
            />
            <Image src={logo.src} alt="logo" width={54} height={54} />
            <div className="flex items-center gap-2 col-start-2">
              <span className="font-bold text-sm text-neutral-900 row-start-2">
                {profile?.loyalty_id}
              </span>
            </div>
          </div>

          {/* <p className="absolute bottom-2 left-[50%] -translate-x-[50%] text-sm text-neutral-900">
            {profile?.loyalty_id || "0"}
          </p> */}
        </div>
      </div>
      <CallToActionFB isOpen={isOpen} onClose={() => setOpen(false)} />
    </div>
  );
}
