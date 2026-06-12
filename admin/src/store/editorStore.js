import { create }
from "zustand";

const useEditorStore =
create((set)=>({

 files:[],

 selected:null,

 propsData:[],

 assets:[],

 marketplace:{},

 setFiles:(files)=>
 set({files}),

 setSelected:(selected)=>
 set({selected})

}));

export default
useEditorStore;