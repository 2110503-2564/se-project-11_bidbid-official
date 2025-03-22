import Image from "next/image";
import getVenue from "@/libs/getVenue";
import getMassageShop from "@/libs/getMassageShop";

export default async function MassageDetailPage ( {params} : {params: {mid:string}} ) {

    // const venueDetail = await getVenue(params.vid)
    const massageDetail = await getMassageShop(params.mid)


    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium">{massageDetail.data.name}</h1>
            <div className="flex flex-row my-5">
                <Image src={ massageDetail.data.picture }
                    alt='Massage Image'
                    width={0} height={0} sizes="100vw"
                    className="rounded-lg w-[30%]" />
                <div className="text-medium mx-5 text-left">
                <div className="text-medium mx-5">Name: { massageDetail.data.name }</div>
                <div className="text-medium mx-5">Adress: { massageDetail.data.address }</div>
                <div className="text-medium mx-5">Price Range: { massageDetail.data.priceRange }</div>
                <div className="text-medium mx-5">Tel: { massageDetail.data.phoneNumber }</div>
                <div className="text-medium mx-5">Open Time: { massageDetail.data.openTime }</div>
                <div className="text-medium mx-5">Close Time: { massageDetail.data.closeTime }</div>
                </div>
            </div>
        </main>
    )
}

// export async function generateStaticParams () {
//     return [ {vid:'001'} , {vid:'002'} , {vid:'003'} ]
// }   