import InputBox from "./InputBox"
import ChatBox from "./ChatBox"
import { Dispatch, RefObject, useEffect, useReducer } from "react";
import { StateContext, DispatchContext } from "./Context";
import { ConfigBar } from "./ConfigBar";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

// export interface Dictionary<T> {
//     [Key: string]: T;
// }

export interface Message {
    role: "human" | "ai" | "system";
    content: string;
}

// this state-action reducer is meant to handle the current state of the entire chat app - including all the messages, whether the model is currently thinking or writing, and an abort controller (may remove this though)
export interface State {
    model: string;
    messages: Message[] | [];
    config_visible: boolean;
}

type UpdateModel = {type: "update_model", model: string};
type AddMessage = {type: "addMessage", role: "human" | "ai" | "system", content: string}
type UpdateLastMessage = { type: "updateLastMessage"; payload: string };
type ToggleConfig = {type: "toggle_config"};
export type Actions = UpdateModel | AddMessage | UpdateLastMessage | ToggleConfig;

function reducer(state: State, action: Actions): State {
    switch(action.type) {
        case "update_model":
            return {
                ...state,
                model: action.model
            };
        case "addMessage":
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {role: action.role, content: action.content},
                ],
            };
        case "updateLastMessage":
            const messagesCopy = [...state.messages];
            messagesCopy[messagesCopy.length - 1] = {
                ...messagesCopy[messagesCopy.length - 1],
                content: messagesCopy[messagesCopy.length - 1].content + action.payload
            };
            return {
                ...state,
                messages: messagesCopy,
            };
        case "toggle_config":
            return {
                ...state,
                config_visible: !state.config_visible
            };
        default:
            return state;
    }
}

export function Chat() {

    const initMessage = {role: "ai", content: "Hi there! How can I help you today?"} as Message;

    let state_to_use: State;
    const local_chat_state = sessionStorage.getItem('chat_state');
    if (local_chat_state !== 'undefined' && local_chat_state) {
        state_to_use = JSON.parse(local_chat_state);
    }
    else {
        state_to_use = {model: "gpt-3.5-turbo", messages: [initMessage], config_visible: false};
    }

    const [state, dispatch] = useReducer(reducer, state_to_use);
    
    useEffect(() => {
        sessionStorage.setItem("chat_state", JSON.stringify(state));
    }, [state]);

    const handlePromptNew = async (promptInput: RefObject<HTMLTextAreaElement>) => {
        if (promptInput && promptInput.current) {
            const prompt = promptInput.current.value;
            if (prompt != "") {
                dispatch({ type: "addMessage", role: "human", content: prompt });
                dispatch({ type: "addMessage", role: "ai", content: "" });
                promptInput.current.value = "";

                let res: Response
                let data = null

                // let vectorStore = state.vectorStore;
                // if (vectorStore === null) {
                //     const embResponse = await fetch("http://0.0.0.0:8000/embeddings", {
                //         method: "POST",
                //         headers: {
                //             "Content-type": "application/json"
                //         },
                //         body: JSON.stringify({pageContent: document.documentElement.innerHTML})
                //     });
                //     const emb = await embResponse.json();
                //     vectorStore = emb;
                //     chatDispatch({type: "update_vector_store", vectorStore: emb})
                // }

                console.log(state.model);

                res = await fetch(`${process.env.API}/chat/${state.model}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({messages: [...state.messages, {role: "human", content: prompt} as Message], vectorStore: "", pageURL: document.URL})
                });
                data = res.body;

                if (!data) {
                    return;
                }

                const reader = data.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done  = doneReading;
                    const chunkValue = decoder.decode(value);
                    dispatch({type: "updateLastMessage", payload: chunkValue});
                }
            }
        }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <div className="h-screen w-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center text-black dark:text-white">
                    <ChatBox />
                    <InputBox handlePromptNew={handlePromptNew}/>
                </div>
                <ConfigBar />
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}