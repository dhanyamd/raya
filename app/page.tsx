import Image from "next/image";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/Layout/components/header";
import UserButton from "@/modules/authentication/components/user-button";

export default async function Home() {
  const user = await currentUser();
  return (
     <>
            <UserButton user={user} />
     </>
  )
}