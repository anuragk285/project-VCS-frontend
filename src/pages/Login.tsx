import { useState } from 'react'
import desktopFashionModel from '../assets/images/fashion-model.jpeg'
import mobileFashionModel from '../assets/images/mobile-fahion-model.png'
import Signin from '@/components/signin'
import Signup from '@/components/signup'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function ResponsiveImage(){
  return (
    <div className="absolute inset-0">
      <img src={mobileFashionModel} alt="image of 2 fashion models next to each other" className="block md:hidden h-full w-full object-cover"/>
      <img src={desktopFashionModel} alt="image of 2 fashion models next to each other" className="hidden md:block h-full w-full object-cover"/>
    </div>
  )
}

export default function Login() {
  const [page, setPage] = useState("signin")
  const changePage = (toPage: string) => {
    setPage(toPage)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-0 gap-y-5">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-4xl font-serif tracking-widest font-light text-gold-deep">Vinayaka</h2>
        <span className="tracking-widest font-light text-primary text-xs text-center ">Cloth Store.</span>
      </div>
      <div className="border rounded-3xl grid grid-cols-1 md:grid-cols-2 w-full md:w-[80vw] h-auto md:h-[80vh] shadow-2xl overflow-hidden">
        
        <div className="fashion-model relative h-64 md:h-full flex flex-col justify-between p-10 overflow-hidden">
          <ResponsiveImage />
          <div className="absolute inset-0 pointer-events-none" />

          <div className="hidden md:block relative z-10">
            <h3 className="text-primary-foreground font-serif text-xl md:text-2xl">Vinayaka Cloth Store</h3>
            <p className="text-muted text-[10px] tracking-widest">SHIVANAGAR, WARANGAL</p>
          </div>
          
          <div className="relative z-10 text-muted font-medium hidden md:block">
            <p>Premium Unstitched Fabric.</p>
            <p>Pick your outfit matching your skintone.</p>
          </div>
        </div>

        <div className='bg-primary-foreground px-6 md:px-14 py-8 flex flex-col gap-y-8'>
          <div className="grid grid-cols-2 shrink-0"> 
            <Button 
              className={cn("col-span-1 bg-primary-foreground rounded-none border-2 text-muted-foreground hover:bg-primary-foreground cursor-pointer", 
              page === "signin" ? "border-b-gold-deep text-gold-deep" : "")} 
              onClick={() => changePage("signin")}
            >
              Sign in
            </Button>
            <Button 
              className={cn("col-span-1 bg-primary-foreground rounded-none border-2 text-muted-foreground hover:bg-primary-foreground cursor-pointer", 
              page === "signup" ? "border-b-gold-deep text-gold-deep" : "")} 
              onClick={() => changePage("signup")}
            >
              Sign up
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {page === "signin" && <Signin changePage={changePage} />}
            {page === "signup" && <Signup changePage={changePage} />}
          </div>
        </div>

      </div>
    </div>
  )
}