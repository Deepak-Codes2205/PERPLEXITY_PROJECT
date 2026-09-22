import { createSlice, current } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name:'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {

        createNewChat : (state, action)=>{
            const[chatId, title] = action.payload
            state.chats[chatId] ={
                id: chatId,
                title,
                messages : [],
                lastUpdated: new Date().toISOString(),
            }
           
        },
        addNewMessages : (state, action)=>{
            const { title, content, role } = action.payload
            state.chats[ chatId ].message.push({content, role});
        },
        
        addMessages: (state, action)=>{
            const { chatId, messages} = state.payload
            state.chats[chatId].messages.push(...messages)
        },

        setChats: (state, action) =>{   
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) =>{   
            state.currentChatId = action.payload
        },
        setLoading: (state, action) =>{   
            state.isLoading = action.payload
        },
        setError: (state, action) =>{   
            state.error = action.payload
        }
    }
})

export const { setChats, setLoading, setCurrentChatId, setError, createNewChat, addNewMessages, addMessages} = chatSlice.actions
export default chatSlice.reducer