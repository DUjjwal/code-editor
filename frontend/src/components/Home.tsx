import { InteractiveGridPattern } from "./ui/shadcn-io/interactive-grid-pattern/index"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export function Home() {
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

        <button type="button" className="flex justify-center text-white bg-blue-600 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-lg text-lg px-4 py-2.5 focus:outline-none">Get Started</button>
      </div>
    </div>
  )
}
