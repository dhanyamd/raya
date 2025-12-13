import Image from "next/image";
import { currentUser } from "@/modules/authentication/actions";
import UserButton from "@/modules/components/user-button";
import Header from "@/modules/Layout/components/header";

export default async function Home() {
  const user = await currentUser();
  return (
     <>
            <UserButton user={user} />
     </>
  )
}