import Chat from "../components/Chat";
import Header from "../components/Header";


export default function Home() {
  return (
    <div className="flex items-center justify-center h-[100vh] flex-col bg-custom-background-secondary">
      <Header pathname="/chat"/>
      <Chat />
    </div>
  )
}