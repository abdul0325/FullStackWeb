"use client";

import { FaWhatsapp } from "react-icons/fa";
interface WhatsappButtonProps {
  className?: string;
}
export default function WhatsappButton({ className }: WhatsappButtonProps) {
  const phoneNumber = "+923376824822";
  const message = "Hello Abdul, let's discuss an opportunity.";

  const whatsappLink = `https://wa.me/${phoneNumber.replace(
    /[^\d]/g,
    ""
  )}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        bg-green-500 hover:bg-green-600 
        p-4 rounded-full shadow-lg flex items-center justify-center
        transform transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-2xl cursor-pointer ${className}
      `}
      aria-label="Contact me on WhatsApp"
    >
      <FaWhatsapp className="text-white text-2xl" />
    </a>
  );
}
