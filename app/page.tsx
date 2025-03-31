import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="font-sans">
      <Header pathname="/" />
      <div className="flex items-center justify-center h-[100vh] flex-col">
        <h1 className="text-5xl text-center font-mono uppercase appearance-auto animate-scale-in-hor-center">
          Forge your own adventure with an ai gamemaster !
        </h1>
        <p className="text-custom-text-secondary text-xl animate-scale-in-hor-center">
          " Chat with an AI Dungeon Master, generate stories, and manage your
          campaigns — all in one place! "
        </p>
        <Link
          href={"/chat"}
          className="flex items-center hover:animate-none transition duration-200 active:animate-none active:scale-75 justify-center text-center animate-heartbeat-fadein hover:scale-110 border-2 rounded-md border-custom-border bg-custom-background-primary text-2xl font-bold font-mono w-40 text-custom-text-primary mt-6 h-12"
        >
          Start Chatting
        </Link>
      </div>
      {/* Features */}
      <h2 className="text-5xl font-mono text-center">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-5 mb-96">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl">🔮</span>
          <h2 className="text-2xl font-bold mt-2">AI-Powered Storytelling</h2>
          <p className="text-custom-text-secondary mt-1">
            "The AI adapts to your choices and gameplay."
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl">🎲</span>
          <h2 className="text-2xl font-bold mt-2">Dice Rolling & Combat</h2>
          <p className="text-custom-text-secondary mt-1">
            "Integrated D&D mechanics to enhance gameplay."
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl">📜</span>
          <h2 className="text-2xl font-bold mt-2">Persistent Campaigns</h2>
          <p className="text-custom-text-secondary mt-1">
            "Save and continue your adventures anytime."
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl">🛠</span>
          <h2 className="text-2xl font-bold mt-2">Developer API</h2>
          <p className="text-custom-text-secondary mt-1">
            "Access AI storytelling for your own apps."
          </p>
        </div>
      </div>
    </div>
  );
}
