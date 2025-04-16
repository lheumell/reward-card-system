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
      className="flex items-center gap-2 justify-center p-4 bg-slate-900 rounded-md bg-text-primary font-medium"
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
      <span>Facebook</span>
    </button>
  );
}
