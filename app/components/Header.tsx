

export default function Header() {
  return (
    <div className="absolute border-b-2 border-custom-border top-0 left-0 w-full text-custom-text-primary p-4 flex justify-center align-center">
      <div className="flex justify-end">
        <button className=" bg-custom-background-secondary text-custom-text-secondary rounded-md text-3xl hover:bg-custom-hover w-30 h-12">Login</button>
      </div>
    </div>
  )
}