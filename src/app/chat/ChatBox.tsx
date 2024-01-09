"use client"
import { useEffect, useRef, useContext } from "react";
import { StateContext } from "./Context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

interface MessageProps {
    role: "human" | "ai" | "system";
    content: string;
}
  
function HumanMessage({ text }: { text: string }) {
return (
        <div className="flex flex-col w-5/6 items-start bg-green-200 h-full">
            <div className="h-[30px] w-[30px] mb-2">
            <svg className="w-full h-full dark:fill-white dark:stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            <div className="bg-gray-800 py-2 px-4 w-full rounded-lg h-full min-h-[80px]">
                {text}
            </div>
        </div>
    );
}

function AIMessage({ text }: { text: string }) {
return (
        <div className="flex flex-col w-5/6 items-start bg-green-200 h-full">
            <div className="h-[40px] w-[40px] mb-2">
            <svg className="w-full h-full dark:fill-white dark:stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="#0F0F0F"></path> <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="#0F0F0F"></path> <path d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z" fill="#0F0F0F"></path> <path d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z" fill="#0F0F0F"></path> </g></svg>
            </div>
            <div className="bg-gray-800 py-2 px-4 w-full rounded-lg h-full min-h-[80px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

function Message({ role, content }: MessageProps) {
return (
        <div className="w-full flex flex-col items-center min-h-[120px] text-gray-50 rounded-sm text-sm font-mono mt-4 mb-4">
        {role === "ai" ? <AIMessage text={content} /> : <HumanMessage text={content} />}
        </div>
    );
}

function MessageElement({role, content}: MessageProps) {
    return (
        <div className="p-2 mb-2 flex flex-col w-full rounded-md bg-slate-50 dark:bg-slate-600 dark:border-slate-400 border-slate-200 border-2">
            {role === "ai"?
            <div className="h-[20px] w-[20px] mb-2">
            <svg className="w-full h-full dark:fill-white dark:stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="#0F0F0F"></path> <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="#0F0F0F"></path> <path d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z" fill="#0F0F0F"></path> <path d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z" fill="#0F0F0F"></path> </g></svg>
            </div>
            :<></>}
            {role === "human"?
            <div className="h-[20px] w-[20px] mb-2">
            <svg className="w-full h-full dark:fill-white dark:stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            :<></>}
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="overflow-x-auto">
                {"_____\n\n" + content}
            </ReactMarkdown>
        </div>
    )
}

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
        <div className={`flex-auto items-center bg-theme-50 dark:bg-theme-700 ${isMobile?`w-[90%]`:`w-2/3`} h-full rounded-xl border-solid border-4 border-theme-400 m-10 ${isMobile?`mt-20`:``} py-6 ${isMobile?`px-6`:`px-10`} overflow-auto no-scrollbar shadow-lg shadow-theme-400 outline-theme-400`}>
            {state.messages.map((message, i) => (
                <MessageElement
                key={i}
                role={message.role}
                content={message.content}
                />
            ))}
            <div ref={ref} />
        </div>
    )
}