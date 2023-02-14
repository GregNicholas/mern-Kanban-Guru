import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

interface UserData {
    name: String,
    email: String,
    password: String
}

// Get user from local storage
let user = localStorage.getItem('user')
if(user){
    user = JSON.parse(user)
}
// const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Register user
export const register = createAsyncThunk('auth/register', 
    async (user: UserData, thunkAPI) => {
        console.log("We're in register in authSlice")
        try {
            return await authService.register(user)
        } catch (err:any) {
            const message = (err.response && err.response.data &&
                err.response.data.message) || err.message || err.toString()
            return thunkAPI.rejectWithValue(message)
        }
    })

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    // extra reducers for async actions
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer