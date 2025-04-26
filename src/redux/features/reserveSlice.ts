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
                && (obj.date === action.payload.date)
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
                return (obj.user.name !== action.payload.user.name)
                || (obj.user.phoneNumber !== action.payload.user.phoneNumber)
                || (obj.massageShop !== action.payload.massageShop)
                || (obj.date !== action.payload.date)
            } )
            state.reserveItems = remainItems
        }
    }
})

export const { addReservation , removeReservation } = reserveSlice.actions
export default reserveSlice.reducer