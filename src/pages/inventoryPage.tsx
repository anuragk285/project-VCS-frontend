import InventoryPageHeader from "@/components/InventoryPageHeader"
import InventoryPageFooter from "@/components/InventoryPageFooter"
export default function ShowInventory(){
    return (
        <div className="flex flex-col min-h-screen">
            <header className="">
                <InventoryPageHeader></InventoryPageHeader>
            </header>
            <main className="flex-1">

            </main>
            <footer className="">
                <InventoryPageFooter></InventoryPageFooter>
            </footer>
        </div>
    )
}