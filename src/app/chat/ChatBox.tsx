"use client"
import Message from "./Message"
import ScrollToBottom from "react-scroll-to-bottom";


export default function ChatBox() {
    return (
        <div className="flex-auto items-center bg-teal-500 w-2/3 h-full rounded-3xl border-solid border-4 border-white m-10 overflow-auto no-scrollbar">
            <Message name="human" text="hi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi there hi therehi therehi therehi therehi therehi there
            hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there"/>
            <Message name="ai" text="hi there"/>
            <Message name="human" text="hi there"/>
            <Message name="ai" text="hi there"/>
            <Message name="human" text="hi there"/>
            <Message name="ai" text="hi there"/>
            <Message name="human" text="hi there"/>
            <Message name="ai" text="hi there"/>
            <Message name="human" text="hi there"/>
            <Message name="ai" text="hi there"/>
            <Message name="human" text="hi there"/>
            <Message name="ai" text="hi there"/>
        </div>
        // <div className="flex-auto overflow-hidden ">
        //   <ScrollToBottom
        //     className="relative h-full pb-14 pt-6"
        //     scrollViewClassName="h-full overflow-y-auto"
        //   >
        //     <div className="w-full transition-width flex flex-col items-stretch flex-auto">
        //       <div className="flex-auto">
        //         <div className="flex flex-col prose prose-lg prose-invert">
        //             <Message name="human" text="hi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi there hi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there
        //                 hi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi therehi there"/>
        //                 <Message name="ai" text="hi there"/>
        //                 <Message name="human" text="hi there"/>
        //                 <Message name="ai" text="hi there"/>
        //                 <Message name="human" text="hi there"/>
        //                 <Message name="ai" text="hi there"/>
        //                 <Message name="human" text="hi there"/>
        //                 <Message name="ai" text="hi there"/>
        //                 <Message name="human" text="hi there"/>
        //                 <Message name="ai" text="hi there"/>
        //                 <Message name="human" text="hi there"/>
        //                 <Message name="ai" text="hi there"/> 
        //         </div>
        //       </div>
        //     </div>
        //   </ScrollToBottom>
        // </div>
    )
}