import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FacebookLoginButton } from "@/components/facebook-login-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Se connecter</h1>
      <p className="text-sm text-foreground">
        Vous n'avez pas de compte ?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          S'inscrire
        </Link>
      </p>
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
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Mot de passe</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Votre mot de passe"
          required
        />
        <SubmitButton pendingText="Connexion..." formAction={signInAction}>
          Se connecter
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
