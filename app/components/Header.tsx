import Link from "next/link";

export default function Header() {
  return (
    <div className="absolute border-b-2 border-custom-border top-0 left-0 w-full text-custom-text-primary p-4 flex justify-between items-center">
      <div className="text-3xl">
        <h1>RoleplayChat</h1>
      </div>
      <div className="flex-grow text-center text-2xl font-bold">
        <Link href='' className='pl-3'>Home</Link>
        <Link href=''>Chat</Link>
        <Link href=''>API Docs</Link>
        <Link href=''>API Keys</Link>
      </div>
      <Link
        href="api/auth/signin"
        className=" bg-custom-background-secondary border-1 border-custom-border items-center justify-center flex hover:border-custom-text-primary text-custom-text-primary rounded-md text-[25px] duration-200 hover:bg-custom-hover active:bg-custom-click active:scale-90 hover:scale-110 hover:rotate-6 w-24 h-12"
      >
        Login
      </Link>
    </div>
  );
}
