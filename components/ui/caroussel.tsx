"use client";
import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import truck from "@/assets/food_truck.png";
import cottonCandy from "@/assets/cotton_candy.png";
import contact from "@/assets/contact.png";

interface CardProps {
  title: string;
  description: string | ReactNode;
  icon: StaticImageData;
}

const Caroussel: React.FC = () => {
  const handleRedirect = () => {
    window.open(
      "https://www.facebook.com/profile.php?id=61573519172124&locale=fr_FR",
      "_blank"
    );
  };

  const cards: CardProps[] = [
    {
      title: "Prestation à domicile",
      description: "A ch'camion se déplace à domicile pour vos événements.",
      icon: truck,
    },
    {
      title: "Location de materiels",
      description: "Fontaine à punch, mange debout et bien plus !",
      icon: cottonCandy,
    },
    {
      title: "Contactez nous !",
      description: (
        <>
          Pour plus d'informations, contactez-nous sur{" "}
          <span className="underline" onClick={handleRedirect}>
            facebook
          </span>
        </>
      ),
      icon: contact,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "16px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="shadow-lg rounded-xl p-4 min-w-[90%] bg-white"
        >
          <div className="flex items-center gap-2">
            <Image
              src={card.icon.src} // Utilisez `close.src` pour obtenir l'URL de l'image
              alt="close"
              width={card.icon.width} // Largeur de l'image
              height={card.icon.height} // Hauteur de l'image
              className="w-6 h-6"
            />{" "}
            <h3 className="font-bold">{card.title}</h3>
          </div>
          <p className="text-neutral-400 size-sm">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Caroussel;
