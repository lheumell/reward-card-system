"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type TProfile = {
  id: string;
  loyalty_id: string;
  user_id: string;
  fidelity_points: number;
};

export function useProfile() {
  const supabase = createClient();

  const [profile, setProfile] = useState<TProfile | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  return profile;
}
