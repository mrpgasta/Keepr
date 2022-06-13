import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc, query,where} from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";



const initialState = {
    keepList: []
}


export const GetKeeps = createAsyncThunk("keeps/GetKeeps", async (currentUID) => {

    const keepCollectionRef = query(collection(db, "keeps"), where("uid", "==", currentUID));
    const data = await getDocs(keepCollectionRef);
    const keeps = []
    data.forEach((doc) => {
        keeps.push({
            id: doc.data().id,
            label: doc.data().label,
            password: doc.data().password,
            uid: doc.data().uid
        }); 
    });
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
        // const existingUser = state.find(keep => keep.id === id);
        // if(existingUser) {
        //     existingUser.label = label;
        //     existingUser.password = password;
        // }
        const editKeep = async () => {
            const keepRef = doc(db, "keeps", id);

            await updateDoc(keepRef, {
                label: label,
                password: password
            });
        }
        editKeep();

        return state
    },
    deleteKeep: (state, action) => {
        const deleteKeep = async () => {
            await deleteDoc(doc(db, "keeps", action.payload));
        }
        deleteKeep();

        return state
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(GetKeeps.fulfilled, (state, action) => {
        state.keepList = action.payload
    })
//   extraReducers: (builder) => {
//     builder.addCase(GetKeeps.fulfilled, (state, action) => ({
//         ...state,
//         keep: action.payload, 
//     }))
}
});



export const { addKeep, editKeep, deleteKeep } = keepSlice.actions;
export default keepSlice.reducer;