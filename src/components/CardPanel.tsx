'use client'
import { Reducer, useReducer } from "react"
import Card from "./Card"
import Link from "next/link";

export default function CardPanel() {

    let defaultVenue = new Map<string,number>([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]);

    const cardReducer = (
        venueList: Map<string, number>,
        action: {type:string, venueName:string, rating?:number}
    ) => {

        switch(action.type) {
            case 'add': {
                const newVenueList = new Map(venueList)
                newVenueList.set(action.venueName, action.rating??0)
                return newVenueList
            }
            case 'remove': {
                const newVenueList = new Map(venueList)
                newVenueList.delete(action.venueName)
                return newVenueList
            }
            default: return  defaultVenue
        }
    }

    const [ venueList, dispatchRating ] = useReducer( cardReducer, defaultVenue )

    // Mock Data
    const mockVenueRepo = [
        { vid: "001", name: "The Bloom Pavilion", image: "/img/bloom.jpg" },
        { vid: "002", name: "Spark Space",        image: "/img/sparkspace.jpg" },
        { vid: "003", name: "The Grand Table",    image: "/img/grandtable.jpg" }
    ]

    return(
        <div>
            <div style={{margin:"20px", 
            display:"flex", 
            flexDirection:"row",
            flexWrap:"wrap", justifyContent:"space-around", alignContent:"space-around"}}>
                {
                    mockVenueRepo.map((venueItem)=>(
                        <Link href={`/venue/${venueItem.vid}`} className="w-1/5">
                            <Card 
                                venueName={venueItem.name} 
                                imgSrc={venueItem.image}
                                rating={venueList.get(venueItem.name) ?? 0}
                                onRating={ (venue:string, rating:number) => dispatchRating({type:'add', venueName:venue, rating}) }
                            />
                        </Link>
                    ))
                }
            </div>

            <div className="w-full text-xl font-medium px-5">Venue List with Ratings: {venueList.size}</div>
            { Array.from(venueList).map( ([venueName, rating])=>
            <div key={venueName} data-testid={venueName} className="px-5"
            onClick={ ()=>dispatchRating({type:'remove', venueName: venueName }) }>
            {venueName} : {rating}
            </div> ) }
        </div>
    );
}