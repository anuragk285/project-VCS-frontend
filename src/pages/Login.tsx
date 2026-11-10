import { useState } from 'react'
import fashionModel from '../assets/images/fashion-model.jpeg'
import Signin from '@/components/signin'
import Signup from '@/components/signup'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'

export default function Login() {
  const [page, setPage] = useState("signup")
  const changePage = (toPage: string) => {
    setPage(toPage)
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border rounded-3xl grid grid-cols-2 w-[80vw] h-[80vh] shadow-2xl overflow-y-hidden">
        
        <div className="fashion-model col-span-1 relative h-full flex flex-col justify-between p-10 overflow-hidden">
          <img src={fashionModel} alt="image of a fashion model wearing classic formal outfit." className='absolute inset-0 h-full w-full object-cover'/>
          <div className="absolute inset-0 pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-primary-foreground font-serif text-2xl">Vinayaka Cloth Store</h3>
            <p className="text-muted text-[10px] tracking-widest">SHIVANAGAR, WARANGAL</p>
          </div>
          
          <div className="relative z-10 text-muted font-medium">
            <p>Premium Unstitched Fabric.</p>
            <p>Pick your outfit matching your skintone.</p>
          </div>
        </div>

        <div className='col-span-1 bg-primary-foreground px-14 py-5 flex flex-col gap-y-8 overflow-hidden'>
          <div className="grid grid-cols-2 shrink-0"> 
            <Button className={cn("col-span-1 bg-primary-foreground rounded-none border-2 text-muted-foreground hover:bg-primary-foreground cursor-pointer", page === "signin" ? "border-b-gold-deep text-gold-deep" : "")} onClick={() => changePage("signin")}>Sign in</Button>
            <Button className={cn("col-span-1 bg-primary-foreground rounded-none border-2 text-muted-foreground hover:bg-primary-foreground cursor-pointer", page === "signup" ? "border-b-gold-deep text-gold-deep" : "")} onClick={() => changePage("signup")}>Sign up</Button>
          </div>
          <div className="col-span-1 flex-1 overflow-y-auto pr-2">
            {page === "signin" && <Signin changePage={changePage}></Signin>}
            {page === "signup" && <Signup changePage={changePage}></Signup>}
          </div>
        </div>
      </div>
    </div>
  )
}