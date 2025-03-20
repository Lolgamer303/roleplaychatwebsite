export default function Header() {
  return (
    <div className="absolute border-b-2 border-custom-border top-0 left-0 w-full text-custom-text-primary p-4 flex justify-between items-center">
      <div className="flex-grow text-center">
        <h1 className="text-3xl font-bold">Roleplay Chat</h1>
      </div>
      <div>
        <button className="bg-custom-background-secondary text-custom-text-secondary font-bold rounded-md text-3xl hover:bg-custom-hover w-30 h-12">
          Login
        </button>
      </div>
    </div>
  );
}