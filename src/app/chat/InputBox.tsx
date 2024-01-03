
"use client"

import { useRef, KeyboardEvent, useContext } from "react";
import { TextareaAutosize } from "@mui/base";
import { PuffLoader } from "react-spinners";
import { StateContext, DispatchContext } from "./Context";
import { State } from "./Chat";

function UploadButton() {
    return (
        <div className="flex justify-center items-center bg-red-200 h-full aspect-square">
            <button type="button" className="text-white w-2/3 h-2/3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
        </div>
    )
}

function SendButton({state, onClick}: {state: State, onClick: () => Promise<void>}) {
    return (
        <div className="flex justify-center items-center bg-red-200 h-full aspect-square">
            {state.thinking || state.writing ? 
            (<PuffLoader color="#36d7b7" loading speedMultiplier={1.5}/>) 
            :
            (<button type="button" onClick={onClick} className="text-white w-2/3 h-2/3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z" fill="#ffffff"></path> </g></svg>
            </button>)}
        </div> 
    )
}

export default function InputBox() {

    const promptInput = useRef<HTMLTextAreaElement>(null);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handlePrompt = async () => {
        if (promptInput && promptInput.current) {
            const prompt = promptInput.current.value;
            if (prompt != "") {
                const controller = new AbortController();
                const signal = controller.signal;
                dispatch({ type: "addMessage", payload: { prompt, controller }});
                promptInput.current.value = "";

                let res: Response
                let data = null
                
                res = await fetch(`http://0.0.0.0:8000/chat/${state.model_name}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({messages: state.messages, prompt: prompt})
                });
                data = res.body;

                if (!data) {
                    return;
                }

                const reader = data.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const {value, done: doneReading} = await reader.read();
                    done  = doneReading;
                    const chunkValue = decoder.decode(value);
                    dispatch({type: "updateAnswer", payload: chunkValue});
                }
                if (done) {
                    dispatch({type: "done"});
                }
            }
        }
    }

    return (
        <div className="flex flex-row justify-evenly items-center bg-yellow-500 min-h-[70px] h-24 w-2/3 mb-10 text-black">
            <UploadButton />
            <TextareaAutosize 
            ref={promptInput}
            name="prompt"
            id="prompt"
            minRows={1}
            maxRows={4}
            onKeyDown={async (e: KeyboardEvent<HTMLTextAreaElement>) => {
                e.stopPropagation();
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePrompt();
                }
            }}
            className="bg-red-400 resize-none pl-6 pr-6 pt-3 pb-3 ml-4 mr-4 h-full w-full rounded-full text-lg font-mono"
            placeholder="What's up?"
            defaultValue=""
            />
            <SendButton state={state} onClick={handlePrompt}/>
        </div>
    )
}