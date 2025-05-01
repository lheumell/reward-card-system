"use client";
import { Button } from "@/components/ui/button";

export default function EmailConfirmationPage() {
  return (
    <div className="bg-[url(../assets/bg.png)] bg-cover bg-repeat-y bg-center  h-[calc(100vh-200px)] flex flex-col justify-center bg-white px-4 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 p-2">
        Merci pour votre inscription !
      </h1>
      <p className="text-gray-700 text-lg mb-6 bg-white border-2 border-gray-200 rounded-lg p-2">
        Nous vous avons envoyé un e-mail pour confirmer votre inscription.
        Veuillez vérifier votre boîte de réception.
      </p>
      <p className="text-gray-500 text-sm bg-white border-2 border-gray-200 rounded-lg p-2">
        Pensez à vérifier vos courriers indésirables si vous ne voyez pas
        l’e-mail dans les prochaines minutes.
      </p>
      <Button
        className="mt-8 "
        onClick={() => (window.location.href = "/sign-in")}
      >
        Se connecter
      </Button>
    </div>
  );
}
