import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  pathname: string;
}

export default async function Header({ pathname }: HeaderProps) {
  const session = await getServerSession();

  return (
    <div className="z-[10] bg-custom-background-primary fixed border-b-2 border-custom-border top-0 left-0 w-full text-custom-text-primary p-2 flex justify-between items-center">
      <div className="text-[18px] hover:border-custom-text-secondary transition duration-300 group font-bold border-r-2 border-custom-border pr-3 w-30">
        <Link href="/">RoleplayChat</Link>
      </div>
      <div className="flex-grow text-center text-[16px] relative">
        <div className="relative">
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-7 text-custom-text-secondary group relative active:scale-90 active:text-custom-text-primary"
            >
              Home
              <span
                className={`absolute bottom-[-17.5px] left-1/2 transform -translate-x-1/2 h-[1.5px] bg-white transition-all duration-300 ease-in-out ${
                  pathname === "/" ? "w-10/12" : "w-0 group-hover:w-10/12"
                }`}
              ></span>
            </Link>
            <Link
              href="/chat"
              className="px-7 text-custom-text-secondary group relative active:scale-90 active:text-custom-text-primary"
            >
              Chat
              <span
                className={`absolute bottom-[-17.5px] left-1/2 transform -translate-x-1/2 h-[1.5px] bg-white transition-all duration-300 ease-in-out ${
                  pathname === "/chat" ? "w-10/12" : "w-0 group-hover:w-10/12"
                }`}
              ></span>
            </Link>
            <Link
              href="/docs"
              className="px-7 text-custom-text-secondary group relative active:scale-90 active:text-custom-text-primary"
            >
              API Docs
              <span
                className={`absolute bottom-[-17.5px] left-1/2 transform -translate-x-1/2 h-[1.5px] bg-white transition-all duration-300 ease-in-out ${
                  pathname === "/docs" ? "w-10/12" : "w-0 group-hover:w-10/12"
                }`}
              ></span>
            </Link>
            <Link
              href="/keys"
              className="px-7 text-custom-text-secondary group relative active:scale-90 active:text-custom-text-primary"
            >
              API Keys
              <span
                className={`absolute bottom-[-17.5px] left-1/2 transform -translate-x-1/2 h-[1.5px] bg-white transition-all duration-300 ease-in-out ${
                  pathname === "/keys" ? "w-10/12" : "w-0 group-hover:w-10/12"
                }`}
              ></span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex relative group justify-end border-l-2 border-custom-border pl-3 transition duration-300 hover:border-custom-text-secondary">
        {session ? (
          <div className="flex items-center">
            {session.user.image ? (
              <div className="relative group">
                <Image
                  className="rounded-full"
                  src={session.user.image}
                  alt="User Image"
                  width={40}
                  height={40}
                />
                <Link
                  className="absolute opacity-0 translate-y-[-25px] group-hover:translate-y-3.5 group-hover:opacity-100 flex items-center justify-center bg-custom-background-primary text-red-500 text-[12px] font-bold rounded-md w-[72px] h-[34px] top-[40px] left-[-30px] z-[9999] transition-all duration-300"
                  href={`/api/auth/signout`}
                >
                  Disconnect
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[2px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-custom-background-primary opacity-70"></span>
                </Link>
              </div>
            ) : (
              <div className="relative group">
                <Image
                  className="rounded-full"
                  src="https://lh3.googleusercontent.com/a/default-user"
                  alt="User Image"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </div>
        ) : (
          <Link
            href="api/auth/signin"
            className="h-10 w-30 text-[18px] flex items-center"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
