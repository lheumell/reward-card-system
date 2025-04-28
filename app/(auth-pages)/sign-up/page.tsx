import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FacebookLoginButton } from "@/components/facebook-login-button";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto justify-between">
        <h1 className="text-2xl font-medium">S'inscrire</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <FacebookLoginButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OU CONTINUEZ AVEC
              </span>
            </div>
          </div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="ch'camion@exemple.com" required />
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            type="password"
            name="password"
            placeholder="Votre mot de passe"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Inscription...">
            S'inscrire
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
