import ReactMarkdown from "react-markdown";
import { BrowsePageState } from "./Search";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function Browse({index, browse_page_state, getSummary}: {index: number, browse_page_state: BrowsePageState, getSummary: (index: number, link: string) => Promise<void>}) {

    return (
        <div className="flex w-full h-full bg-blue-100 text-black">
        <div className="flex flex-col justify-center items-center w-1/2 h-full bg-green-100">
            {/* <div className="h-[100px] w-full flex justify-center items-center">
                <button onClick={() => {getSummary(index, browse_page_state.search_result.link)}} className="bg-red-100 h-full px-8 hover:bg-red-300">Summarize</button>
            </div> */}
            <div className="flex justify-center items-start h-full max-h-[50%] w-full bg-slate-200">
                <div className="w-[95%] max-h-[95%] my-3 p-6 bg-red-100 rounded-xl font-mono overflow-y-auto overflow-x-clip">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {browse_page_state.summary}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="h-full w-full bg-slate-400"></div>
        </div>
        <div className="flex justify-center items-center w-1/2 h-full bg-red-200">
            
        </div>
        </div>
    );
}