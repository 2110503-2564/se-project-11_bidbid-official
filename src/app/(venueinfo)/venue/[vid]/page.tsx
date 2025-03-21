import Image from "next/image";
import getVenue from "@/libs/getVenue";

export default async function VenueDetailPage ( {params} : {params: {vid:string}} ) {
    // Mock Data
    // const mockVenueRepo = new Map()
    // mockVenueRepo.set( "001" , {name: "The Bloom Pavilion", image: "/img/bloom.jpg"} )
    // mockVenueRepo.set( "002" , {name: "Spark Space",        image: "/img/sparkspace.jpg"} )
    // mockVenueRepo.set( "003" , {name: "The Grand Table",    image: "/img/grandtable.jpg"} )

    const venueDetail = await getVenue(params.vid)

    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium">{venueDetail.data.name}</h1>
            <div className="flex flex-row my-5">
                <Image src={ venueDetail.data.picture }
                    alt='Venue Image'
                    width={0} height={0} sizes="100vw"
                    className="rounded-lg w-[30%]" />
                <div className="text-medium mx-5 text-left">
                <div className="text-medium mx-5">Name: { venueDetail.data.name }</div>
                <div className="text-medium mx-5">Adress: { venueDetail.data.address }</div>
                <div className="text-medium mx-5">District: { venueDetail.data.district }</div>
                <div className="text-medium mx-5">Postal Code: { venueDetail.data.postalcode }</div>
                <div className="text-medium mx-5">Tel: { venueDetail.data.tel }</div>
                <div className="text-medium mx-5">Daily Rate: { venueDetail.data.dailyrate }</div>
                </div>
            </div>
        </main>
    )
}

// export async function generateStaticParams () {
//     return [ {vid:'001'} , {vid:'002'} , {vid:'003'} ]
// }   