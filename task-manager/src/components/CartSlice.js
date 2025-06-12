import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Initialize items as an empty array
  },
  reducers: {
    addItem: (state, action) => {
        const { task_id, title, description, status,priority,createdDate,dueDate } = action.payload;
        const existingItem = state.items.find(item => item.task_id === task_id);
        if (existingItem) {
           existingItem.title = title;
          existingItem.description=description;
          existingItem.status=status;
          existingItem.priority=priority;
          existingItem.dueDate=dueDate;
          existingItem.action='update';
          existingItem.synced=false;
        } else {
            state.items.push({ "task_id":task_id, "title":title, "description":description, "status":status,"priority":priority,"createdDate":createdDate,"dueDate":dueDate,"action":'created',"synced":false});
        }
    },
    removeItem: (state, action) => {
        const { task_id } = action.payload;
        const existingItem = state.items.find(item => item.task_id === task_id);
        if (existingItem) {
          existingItem.action='delete';
          existingItem.synced=false;
        }
    },
    deleteItem: (state, action) => {
        state.items = state.items.filter(item => item.task_id !== action.payload.task_id);
    },
    updateItem: (state, action) => {
        const { task_id, title, description, status,priority,dueDate } = action.payload;
        const itemToUpdate = state.items.find(item => item.task_id === task_id);
        if (itemToUpdate) {
          itemToUpdate.title = title;
          itemToUpdate.description=description;
          itemToUpdate.status=status;
          itemToUpdate.priority=priority;
          itemToUpdate.dueDate=dueDate;
          if(itemToUpdate.action==='loaded'){
            itemToUpdate.action='update'; //if not, remain created until id is updated
          }
          itemToUpdate.synced=false;
        }
    },
    updateId: (state, action) => {
        const { oldTask_id,newTask_id } = action.payload;
        const itemToUpdate = state.items.find(item => item.task_id === oldTask_id);
        if (itemToUpdate) {
          itemToUpdate.task_id = newTask_id;
          itemToUpdate.action='loaded';
          itemToUpdate.synced=true;
        }
    },
    resetCart: (state)=>{
      state.items =  [];
    },
    addItemZero: (state, action) => {
        const { task_id, userId, title, description, status,priority,createdDate,dueDate } = action.payload;
        state.items.push({ task_id, title, description, status,priority,createdDate,dueDate,action:'loaded',synced:true});
        
    },
    syncedItems:(state,action)=>{
      for(let i=0;i<action.payload.length;i++){
        const existingItem = state.items.find(item => item.task_id === action.payload[i]);
        if(existingItem){
          existingItem.action='loaded';
          existingItem.synced= true;
        }
      }
      console.log(JSON.parse(JSON.stringify(state.items)));
    }
  },
});

export const { addItem, removeItem, updateItem, resetCart, addItemZero,syncedItems,updateId,deleteItem } = CartSlice.actions;

export default CartSlice.reducer;
