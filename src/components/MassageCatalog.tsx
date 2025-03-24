import Link from "next/link";
import Card from "./Card";
import { VenueItem , VenueJson } from "../../interface";
import { MassageItem , MassageJson } from "../../interface";
import getVenues from "@/libs/getVenues";
import getMassageShops from "@/libs/getMassageShops";

export default async function MassageCatalog( {massageJson} : {massageJson:Promise<MassageJson>} ) {
    const massageJsonReady = await getMassageShops();

    return (
        <>
        <p>Explore {massageJsonReady.count} Massages in our catalog</p>
        <div 
        className="m-5 flex flex-row flex-wrap justify-around content-around p-2"
        // style={{ margin:"20px", display:"flex", flexDirection:"row", flexWrap:"wrap", 
        //     justifyContent:"space-around", alignContent:"space-around", padding:"10px" }}
        >
            {
                massageJsonReady.data.map((massageItem:MassageItem)=>(
                    <Link key={massageItem.id} href={`/massage/${massageItem.id}`} className="w-1/5">
                        <Card massageName={massageItem.name} imgSrc={massageItem.picture}/>
                    </Link>
                ))

            }
        </div>
        </>
    )
}