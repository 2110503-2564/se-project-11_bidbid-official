
import MassageCatalog from "@/components/MassageCatalog";
import getMassageShops from "@/libs/getMassageShops";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function Massage(){

    // const venues = getVenues()
    const massages = getMassageShops()

    return(
        <main className="text-center p-5">
            <h1 className="text-xl font-medium">Select Your Massage Shop</h1>
            <Suspense fallback={ <p>Loading ... <LinearProgress/></p>}>
                {/* <VenueCatalog massageJson={massages} /> */}
                <MassageCatalog massageJson={massages} />
            </Suspense>
            
            {/* <CardPanel/> */}
        </main>
    );
}