import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem, ReservationItem } from "../../../interface";

type reserveState = {
    reserveItems: ReservationItem[],
}

const initialState: reserveState = { reserveItems: [] }

export const reserveSlice = createSlice ({
    name: "reserve",
    initialState,
    reducers: {
        addReservation: ( state, action: PayloadAction<ReservationItem> ) => {
            const existingIndex = state.reserveItems.findIndex( obj => {
                return (obj.massageShop === action.payload.massageShop) 
                && (obj.reserveDate === action.payload.reserveDate)
            })

            if(existingIndex !== -1) {
                state.reserveItems[existingIndex] = action.payload
            }
            else state.reserveItems.push(action.payload)
            // state.bookItems.push(action.payload)
            // console.log(state.bookItems)
        },
        removeReservation: ( state, action: PayloadAction<ReservationItem> ) => {
            const remainItems = state.reserveItems.filter ( obj => {
                return (obj.nameLastname !== action.payload.nameLastname)
                || (obj.tel !== action.payload.tel)
                || (obj.massageShop !== action.payload.massageShop)
                || (obj.reserveDate !== action.payload.reserveDate)
            } )
            state.reserveItems = remainItems
        }
    }
})

export const { addReservation , removeReservation } = reserveSlice.actions
export default reserveSlice.reducer