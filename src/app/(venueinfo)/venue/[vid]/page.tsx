import Image from "next/image";
import getVenue from "@/libs/getVenue";

export default async function VenueDetailPage ( {params} : {params: {vid:string}} ) {

    const venueDetail = await getVenue(params.vid)

    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium">{venueDetail.data.name}</h1>
            <div className="flex flex-row my-5">
                <Image src={ venueDetail.data.picture }
                    alt='Massage Image'
                    width={0} height={0} sizes="100vw"
                    className="rounded-lg w-[30%]" />
                <div className="text-medium mx-5 text-left">
                <div className="text-medium mx-5">Name: { venueDetail.data.name }</div>
                <div className="text-medium mx-5">Adress: { venueDetail.data.address }</div>
                <div className="text-medium mx-5">Price Range: { venueDetail.data.priceRange }</div>
                <div className="text-medium mx-5">Tel: { venueDetail.data.phoneNumber }</div>
                <div className="text-medium mx-5">Open Time: { venueDetail.data.openTime }</div>
                <div className="text-medium mx-5">Close Time: { venueDetail.data.closeTime }</div>
                </div>
            </div>
        </main>
    )
}

// export async function generateStaticParams () {
//     return [ {vid:'001'} , {vid:'002'} , {vid:'003'} ]
// }   