import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interface";

type bookState = {
    bookItems: BookingItem[],
}

const initialState: bookState = { bookItems: [] }

export const bookSlice = createSlice ({
    name: "book",
    initialState,
    reducers: {
        addBooking: ( state, action: PayloadAction<BookingItem> ) => {
            const existingIndex = state.bookItems.findIndex( obj => {
                return (obj.venue === action.payload.venue) 
                && (obj.bookDate === action.payload.bookDate)
            })

            if(existingIndex !== -1) {
                state.bookItems[existingIndex] = action.payload
            }
            else state.bookItems.push(action.payload)
            // state.bookItems.push(action.payload)
            // console.log(state.bookItems)
        },
        removeBooking: ( state, action: PayloadAction<BookingItem> ) => {
            const remainItems = state.bookItems.filter ( obj => {
                return (obj.nameLastname !== action.payload.nameLastname)
                || (obj.tel !== action.payload.tel)
                || (obj.venue !== action.payload.venue)
                || (obj.bookDate !== action.payload.bookDate)
            } )
            state.bookItems = remainItems
        }
    }
})

export const { addBooking , removeBooking } = bookSlice.actions
export default bookSlice.reducer