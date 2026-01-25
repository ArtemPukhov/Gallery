import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Передвижники — главная",
  description:
    "Выберите художника, исследуйте работы и читайте описания ключевых полотен передвижников."
};

export default function Page() {
  return <HomePage />;
}
