import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, setDoc, doc} from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";

const initialState = [];

export const GetKeeps = createAsyncThunk("keeps/GetKeeps", async () => {
    const keepCollectionRef = collection(db, "keeps");
    const data = await keepCollectionRef.where('uid', '==', 'eGRr9pfALUaCwFvcduzWJc7EfXx2').get();
    const keeps = []
    data.forEach((doc) => {
        keeps.push({
            id: doc.data().id,
            label: doc.data().label,
            password: doc.data().password,
            uid: doc.data().uid
        }); 
    });
    console.log('on GetKeeps...')
    // initialState.push(keeps)
    return keeps;
})


const keepSlice = createSlice({
  name: 'keeps',
  initialState,
  reducers: {
    addKeep: (state, action) => {
        const setTodos = async () => {
            await setDoc(doc(db, "keeps", action.payload.id), {
                id: action.payload.id,
                label: action.payload.label,
                password: action.payload.password,
                uid: action.payload.uid
            });
        }
        setTodos();
        return state
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
    
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(GetKeeps.fulfilled, (state, action) => {
        console.log(action.payload)
      // Add user to the state array
      state.push(action.payload)
    })
  },
});



export const { addKeep, editKeep, deleteKeep } = keepSlice.actions;
export default keepSlice.reducer;