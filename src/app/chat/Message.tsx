import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageProps {
  name: "human" | "ai" | "system";
  text: string;
  thinking: boolean;
}

function HumanMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-col w-5/6 items-start bg-green-200 h-full">
      <div className="bg-blue-400 min-h-[40px]">icon</div>
      <div className="bg-gray-800 py-2 px-4 w-full rounded-lg h-full min-h-[80px]">
        {text}
      </div>
    </div>
  );
}

function AIMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-col w-5/6 items-start bg-green-200 h-full">
      <div className="bg-blue-400 min-h-[40px]">icon</div>
      <div className="bg-gray-800 py-2 px-4 w-full rounded-lg h-full min-h-[80px]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default function Message({ name, text, thinking }: MessageProps) {
  return (
    <div className="w-full flex flex-col items-center min-h-[120px] text-gray-50 rounded-sm text-sm font-mono mt-4 mb-4">
      {name === "ai" ? <AIMessage text={text} /> : <HumanMessage text={text} />}
    </div>
  );
}