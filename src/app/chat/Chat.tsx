"use client"
import InputBox from "./InputBox"
import ChatBox from "./ChatBox"
import Message from "./Message"
import { Dispatch, useEffect, useReducer } from "react";
import { StateContext, DispatchContext } from "./Context";
import { ConfigBar } from "./ConfigBar";

export interface Message {
    name: "human" | "ai" | "system";
    text: string;
}

// this state-action reducer is meant to handle the current state of the entire chat app - including all the messages, whether the model is currently thinking or writing, and an abort controller (may remove this though)
export interface State {
    model_name: string;
    openai_api_key: string | null;
    messages: Message[] | [];
    controller: AbortController | null;
    thinking: boolean;
    writing: boolean;
    config_visible: boolean;
}

type UpdateModel = {type: "update_model", model_name: string};
type UpdateOpenAIAPIKey = {type: "update_openai_api_key", openai_api_key: string}
type AddMessage = {
    type: "addMessage";
    payload: { prompt: string; controller: AbortController };
  };
type UpdateAnswer = { type: "updateAnswer"; payload: string };
type Abort = { type: "abort" };
type Done = { type: "done" };
type ToggleConfig = {type: "toggle_config"};
export type Actions = UpdateModel | UpdateOpenAIAPIKey | AddMessage | UpdateAnswer | Abort | Done | ToggleConfig;

function reducer(state: State, action: Actions): State {
    switch(action.type) {
        case "update_model":
            return {
                ...state,
                model_name: action.model_name
            };
        case "update_openai_api_key":
            return {
                ...state,
                openai_api_key: action.openai_api_key
            };
        case "addMessage":
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {name: "human", text: action.payload.prompt},
                    {name: "ai", text: ""}
                ],
                controller: action.payload.controller,
                thinking: true
            };
        case "updateAnswer":
            const messagesCopy = [...state.messages];
            messagesCopy[messagesCopy.length - 1] = {
                ...messagesCopy[messagesCopy.length - 1],
                text: messagesCopy[messagesCopy.length - 1].text + action.payload
            };
            return {
                ...state,
                messages: messagesCopy,
                thinking: false,
                writing: true
            };
        case "abort":
            state.controller?.abort();
            return {
                ...state,
                thinking: false,
                writing: false,
                controller: null
            };
        case "done":
            return {
                ...state,
                thinking: false,
                writing: false,
                controller: null
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

    // const [state, dispatch] = useReducer(reducer, {
    //     model_name: "gpt-3.5-turbo", 
    //     openai_api_key: null,
    //     messages: [
    //         // {name: "system", text: ""}
    //     ],
    //     controller: null,
    //     thinking: false,
    //     writing: false,
    //     config_visible: false
    // });

    let state: State;
    let dispatch: Dispatch<Actions>;
    const local_chat_state = localStorage.getItem('chat_state');
    if (local_chat_state !== 'undefined' && local_chat_state) {
        [state, dispatch] = useReducer(reducer, JSON.parse(local_chat_state));
        console.log("local_chat_State");
    }
    else {
        [state, dispatch] = useReducer(reducer, {model_name: "gpt-3.5-turbo", openai_api_key: null, messages: [
                // {name: "system", text: ""}
            ], controller: null, thinking: false, writing: false, config_visible: false});
    }

    useEffect(() => {
        localStorage.setItem("chat_state", JSON.stringify(state));
    }, [state]);


    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <div className="h-screen w-full bg-red-500 flex flex-col items-center justify-center">
                    <ChatBox />
                    <InputBox />
                </div>
                <ConfigBar />
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}