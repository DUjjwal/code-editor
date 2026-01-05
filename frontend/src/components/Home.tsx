import { InteractiveGridPattern } from "./ui/shadcn-io/interactive-grid-pattern/index"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios"

export function Home() {

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      const res = await axios.post("http://localhost:4000/api/auth/google", {
        access_token: tokenResponse.access_token
      },{withCredentials: true})


      console.log(tokenResponse)

      console.log(res.data)

      
    }
  })



  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />

      <div className="w-full text-center flex flex-col justify-center items-center gap-y-5 relative z-10">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
          Vibe Code with{" "}
          <mark className="px-2 pb-0.5 text-white bg-blue-600 rounded-lg">
            Intelligence
          </mark>
        </h2>

        <p className="w-[50%] text-lg font-normal text-body">
          Vibe Code Editor is a powerful and intelligent code editor that enhances
          your coding experience with advanced features and seamless integration.
          It is designed to help you write, debug, and optimize your code
          efficiently.
        </p>

        <button type="button" className="flex justify-center items-center gap-x-1 box-border border border-black bg-white hover:bg-gray-100 shadow-xs font-medium leading-5 rounded-lg text-lg p-2" onClick={() => login()}>
          <img src="../public/google.svg" alt="" width="35px" height="35px" />Get Started with Google</button>
      </div>
    </div>
  )
}
