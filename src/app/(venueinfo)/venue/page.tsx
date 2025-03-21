import CardPanel from "@/components/CardPanel";
import VenueCatalog from "@/components/VenueCatalog";
import getVenues from "@/libs/getVenues";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function Venue(){

    const venues = getVenues()

    return(
        <main className="text-center p-5">
            <h1 className="text-xl font-medium">Select Your Venue</h1>
            <Suspense fallback={ <p>Loading ... <LinearProgress/></p>}>
                <VenueCatalog venueJson={venues} />
            </Suspense>
            
            {/* <CardPanel/> */}
        </main>
    );
}