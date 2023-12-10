import InputBox from "./InputBox"
import ChatBox from "./ChatBox"
import Message from "./Message"

interface State {
    messages: Message[] | [],
    
}

export default function Chat() {
    return (
        <div className="h-screen bg-red-500 flex flex-col items-center justify-center">
            <ChatBox />
            <InputBox />
        </div>
    )
}