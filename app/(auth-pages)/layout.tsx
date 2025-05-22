import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/my-account"); // ou une autre page
  }

  return (
    <div className="max-w-7xl flex flex-col gap-12 justify-center items-center my-12 bg-[url(../assets/bg.png)] bg-cover bg-repeat-y bg-center  h-[calc(100vh-300px)]">
      {children}
    </div>
  );
}
