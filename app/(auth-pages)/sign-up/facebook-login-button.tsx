"use client";

import { createClient } from "@/utils/supabase/client";

export function FacebookLoginButton() {
  const handleLoginWithFB = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI_FB,
        scopes: "email pages_show_list pages_read_engagement",
      },
    });

    if (error) {
      console.error("Erreur login :", error);
    } else if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginWithFB}
      className="text-primary font-medium underline"
    >
      Sign in
    </button>
  );
}
