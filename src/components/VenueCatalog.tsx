import Link from "next/link";
import Card from "./Card";
import { VenueItem , VenueJson } from "../../interface";
import getVenues from "@/libs/getVenues";

export default async function VenueCatalog( {venueJson} : {venueJson:Promise<VenueJson>} ) {
    const venueJsonReady = await getVenues();

    return (
        <>
        <p>Explore {venueJsonReady.count} venues in our catalog</p>
        <div style={{ margin:"20px", display:"flex", flexDirection:"row", flexWrap:"wrap", 
            justifyContent:"space-around", alignContent:"space-around", padding:"10px" }}>
            {
                venueJsonReady.data.map((venueItem:VenueItem)=>(
                    <Link key={venueItem.id} href={`/venue/${venueItem.id}`} className="w-1/5">
                        <Card venueName={venueItem.name} imgSrc={venueItem.picture}/>
                    </Link>
                ))

            }
        </div>
        </>
    )
}