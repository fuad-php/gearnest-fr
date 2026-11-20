import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { getServerSession } from "@/lib/server-api";
import type { AppUser } from "@/types";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login?next=/dashboard/profile");

  const user = session.user as unknown as AppUser;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My profile"
        description="Your name, photo and contact details. Owners and renters see this information on confirmed bookings."
      />
      <ProfileForm user={user} />
    </>
  );
}
