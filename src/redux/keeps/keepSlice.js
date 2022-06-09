import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const keepSlice = createSlice({
  name: 'keeps',
  initialState,
  reducers: {
    addKeep: (state, action) => {
        state.push(action.payload)
        console.log(initialState)
    },
    editKeep: (state, action) => {
        const { id, label, password, uid } = action.payload;
        const existingUser = state.find(keep => keep.id === id);
        if(existingUser) {
            existingUser.label = label;
            existingUser.password = password;
        }
    },
    deleteKeep: (state, action) => {
        const { id } = action.payload;
        const existingUser = state.find(keep => keep.id === id);
        if(existingUser) {
            return state.filter(keep => keep.id !== id);
        }
    }
    
  }
});

export const { addKeep, editKeep, deleteKeep } = keepSlice.actions;
export default keepSlice.reducer;