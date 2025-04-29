"use client";

import { createClient } from "@/utils/supabase/client";

const CallToAction = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const supabase = createClient();
  const handleFollow = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }
    const updateFollowStatus = supabase
      .from("profiles")
      .update({ is_follow_fb_page: true })
      .eq("id", user.id);

    const fetchProfile = supabase
      .from("profiles")
      .select("fidelity_points")
      .eq("id", user.id)
      .single();

    const [{ data: profile }] = await Promise.all([
      fetchProfile,
      updateFollowStatus,
    ]);

    const currentPoints = profile?.fidelity_points || 0;

    await supabase
      .from("profiles")
      .update({ fidelity_points: currentPoints + 10 })
      .eq("id", user.id);

    onClose();
  };
  const handleRedirect = () => {
    handleFollow();
    window.open(
      "https://www.facebook.com/profile.php?id=61573519172124&locale=fr_FR",
      "_blank"
    );
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return <div />;

  return (
    <>
      <div className="fixed top-0 left-0 bg-black opacity-60 w-screen h-screen"></div>
      <div className="absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%] flex flex-col justifiy-center gap-4 p-4 bg-background border-2 border-gray-100 rounded-lg w-3/4 shadow-lg z-50">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-medium text-text-primary mt-4">
          Rejoignez-nous sur Facebook
        </h1>
        <div className="flex flex-col gap-4 h-full justify-between">
          <p className="text-sm text-text-secondary">
            Suivez-nous pour des mises à jour, des offres et un bonus sur votre
            carte de fidelité !
          </p>
          <button
            type="button"
            onClick={handleRedirect}
            className="flex items-center justify-center gap-2  p-4 bg-white dark:bg-slate-900 rounded-md bg-text-primary font-medium border border-slate-900"
          >
            <svg
              className="size-6"
              fill="blue"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>{" "}
            <span>Visiter</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
