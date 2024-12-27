import { createSlice } from "@reduxjs/toolkit"

type initialState ={ 
    value:boolean
}

const initialState={
    value:false
} as initialState

export const loginStatus = createSlice({
    name:"loginStatus",
    initialState,
    reducers:{
        changeStatus: (state) => {
            state.value = !state.value;
        },
        
    }
})

export const {changeStatus} = loginStatus.actions
export default loginStatus.reducer