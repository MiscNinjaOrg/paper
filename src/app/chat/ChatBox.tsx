"use client"
import { useEffect, useRef, useContext } from "react";
import { StateContext } from "./Context";
import Message from "./Message"


export default function ChatBox() {

    const state = useContext(StateContext);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.messages.length) {
            ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [state.messages]);

    return (
        <div className="flex-auto items-center bg-teal-500 w-2/3 h-full rounded-3xl border-solid border-4 border-white m-10 overflow-auto no-scrollbar">
            {state.messages.map((message, i) => (
                <Message
                key={i}
                name={message.name}
                text={message.text}
                thinking={state.thinking} 
                />
            ))}
            <div ref={ref} />
        </div>
    )
}