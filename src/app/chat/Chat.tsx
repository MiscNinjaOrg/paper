"use client"
import InputBox from "./InputBox"
import ChatBox from "./ChatBox"
import Message from "./Message"
import { useReducer } from "react";
import { StateContext, DispatchContext } from "./Context";

export interface Message {
    name: "human" | "ai" | "system";
    text: string;
  }

export interface State {
    messages: Message[] | [];
    controller: AbortController | null;
    thinking: boolean;
    writing: boolean;
}

type AddMessage = {
    type: "addMessage";
    payload: { prompt: string; controller: AbortController };
  };
type UpdateAnswer = { type: "updateAnswer"; payload: string };
type Abort = { type: "abort" };
type Done = { type: "done" };
export type Actions = AddMessage | UpdateAnswer | Abort | Done;

function reducer(state: State, action: Actions): State {
    switch(action.type) {
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
        default:
            return state;
    }
}

export function Chat() {

    const [state, dispatch] = useReducer(reducer, {
        messages: [
            // {name: "system", text: ""}
        ],
        controller: null,
        thinking: false,
        writing: false
    });


    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <div className="h-screen w-full bg-red-500 flex flex-col items-center justify-center">
                    <ChatBox />
                    <InputBox />
                </div>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}