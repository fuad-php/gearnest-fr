import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join GearNest as a customer or equipment owner.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
