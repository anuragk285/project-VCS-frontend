import { InputGroupInlineStart } from "./ui/input-group"
import { Button } from "./ui/button"
import { ShoppingCart, Heart } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function InventoryPageHeader(){
    const fabrics = {
        allFabrics: "all-fabrics",
        shirtings: "shirtings",
        pants: "pants",
        towels: "towels"
    }
    const [selectFabric, setSelectFabric] = useState(fabrics.allFabrics)
    const changeFabric = (fabric: string) => {
        setSelectFabric(fabric)
    }
    const fabricNavigationButtonClass = (fabric: string) => {
        return cn("bg-primary-foreground text-primary hover:bg-background border-2 rounded-none cursor-pointer", selectFabric === fabric ? 'border-b-gold-deep' : 'text-muted-foreground')
    }
    const cartItemsCount = 0; // later need to replace this with actual cart count
    return (
        <div className="bg-primary-foreground">
            <div className="flex md:grid md:grid-cols-12 justify-between items-center py-4 px-2 md:px-4">
                <div className="col-span-2 flex flex-col items-center">
                    <h1 className="font-serif text-4xl tracking-widest font-medium">Vinayaka</h1>
                    <p className="text-[10px] text-center text-gold-deep tracking-widest">CLOTH STORE</p>
                </div>
                <div className="hidden md:block md:col-span-7">
                    <InputGroupInlineStart />
                </div>
                <div className="col-span-3">
                    <div className="flex flex-row justify-center items-center gap-x-1 lg:gap-x-5">
                        <Button className="bg-primary-foreground text-primary hover:bg-background hover:cursor-pointer"><Heart/> <span className="hidden md:block">Wishlist</span></Button>
                        <Button className="bg-primary-foreground text-primary hover:bg-background hover:cursor-pointer"><ShoppingCart /><span className="hidden md:block">Cart{cartItemsCount == 0 ? '' : cartItemsCount}</span> </Button>
                        <UserAvatar></UserAvatar>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center gap-x-5 px-2 md:px-6 lg:px-10">
                    <Button className={fabricNavigationButtonClass(fabrics.allFabrics)} onClick={() => changeFabric(fabrics.allFabrics)}>All Fabrics</Button>
                    <Button className={fabricNavigationButtonClass(fabrics.shirtings)} onClick={() => changeFabric(fabrics.shirtings)}>Shirtings</Button>
                    <Button className={fabricNavigationButtonClass(fabrics.pants)} onClick={() => changeFabric(fabrics.pants)}>Pants</Button>
                    <Button className={fabricNavigationButtonClass(fabrics.towels)} onClick={() => changeFabric(fabrics.towels)}>Towels</Button>
                </div>
            </div>
        </div>
    )
}