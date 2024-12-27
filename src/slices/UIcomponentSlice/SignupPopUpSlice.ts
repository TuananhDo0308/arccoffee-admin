import { createSlice } from "@reduxjs/toolkit"

type initialState ={ 
    value:boolean
}

const initialState={
    value:false
} as initialState

export const signupStatus = createSlice({
    name:"signupStatus",
    initialState,
    reducers:{
        changeStatusSignup: (state) => {
            state.value = !state.value;
        },
        
    }
})

export const {changeStatusSignup} = signupStatus.actions
export default signupStatus.reducer