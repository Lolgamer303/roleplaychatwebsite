import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";

export default async function Header() {
  const session = await getServerSession();
  return (
    <div className="absolute border-b-2 border-custom-border top-0 left-0 w-full text-custom-text-primary pt-4 px-4 flex justify-between items-center">
      <div className="text-3xl border-r-2 border-custom-border pr-3">
        <h1>RoleplayChat</h1>
      </div>
      <div className="flex-grow text-center text-2xl font-bold">
        <Link href="" className="px-7 border-r-2 border-custom-border text-custom-text-secondary">
          Home
        </Link>
        <Link href="" className="px-7 border-r-2 border-custom-border text-custom-text-secondary">Chat</Link>
        <Link href="" className="px-7 border-r-2 border-custom-border text-custom-text-secondary">API Docs</Link>
        <Link href="" className="px-7 text-custom-text-secondary">API Keys</Link>
      </div>
      <div className="flex justify-end border-l-2 border-custom-border pl-3">
        {session ? (
          <div className="flex items-center">
            {session.user.image ? (
              <Image
                className="rounded-full"
                src={session.user.image}
                alt="User Image"
                width={40}
                height={40}
              />
            ) : (
              <Image
                className="rounded-full"
                src="https://lh3.googleusercontent.com/a/default-user"
                alt="User Image"
                width={40}
                height={40}
              />
            )}
            <p className="pl-2">{session.user.name}</p>
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}

function LoginButton() {
  return (
    <Link
      href="api/auth/signin"
      className=" bg-custom-background-secondary border-1 border-custom-border items-center justify-center flex hover:border-custom-text-primary text-custom-text-primary rounded-md text-[25px] duration-200 hover:bg-custom-hover active:bg-custom-click active:scale-90 hover:scale-110 hover:rotate-6 w-24 h-12"
    >
      Login
    </Link>
  );
}
