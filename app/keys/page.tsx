"use server"

import { getServerSession } from "next-auth";
import ApiKeysManagement from "../components/ApiKeysManagement";
import Header from "../components/Header";
import { options } from "@/auth";
import prisma from "../lib/db";

export default async function ApiKeysPage() {
  const session = await getServerSession(options)

  let apikeys = null

  if (session && session.user) {
    apikeys = await prisma.apiKey.findMany({
      where: {
        userId: Number(session.user.id)
      },
      select: {
        key: true,
        name: true
      }
    })
  }

  return (
    <div className="flex items-center justify-center h-[100vh] flex-col bg-custom-background-secondary">
      <Header pathname="/keys" />
      <ApiKeysManagement apiKeys={apikeys}/>
    </div>
  );
}