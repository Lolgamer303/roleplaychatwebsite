import Documentation from "../components/Documentation";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="font-sans">
      <Header pathname="/docs"/>
      <div className='mt-15'>
        <Documentation />
      </div>
      
    </div>
  )
}