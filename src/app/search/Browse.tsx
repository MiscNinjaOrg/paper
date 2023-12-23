import ReactMarkdown from "react-markdown";
import { BrowsePageState } from "./Search";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function Browse({index, browse_page_state, getSummary}: {index: number, browse_page_state: BrowsePageState, getSummary: (index: number, link: string) => Promise<void>}) {

    return (
        <div className="flex w-full h-full bg-blue-100">
        
        <div className="flex justify-center items-center w-1/2 h-full bg-red-200">
            {/* <iframe id="iFrameExample"
            className="w-full h-full"
            title="iFrame Example"
            src="https://en.wikipedia.org/wiki/Harris_corner_detector">
            </iframe> */}
            <object data={browse_page_state.search_result.link} className="w-[95%] h-[95%] rounded-md">
            <embed src={browse_page_state.search_result.link}></embed>
            </object>
        </div>
        <div className="flex flex-col justify-center items-center w-1/2 h-full bg-green-100">
            <div className="h-[100px] w-full flex justify-center items-center">
                <button onClick={() => {getSummary(index, browse_page_state.search_result.link)}} className="bg-red-100 h-full px-8 hover:bg-red-300">Summarize</button>
            </div>
            <div className="flex justify-center items-start h-full max-h-[50%] w-full bg-slate-200">
                <div className="w-[95%] max-h-[95%] my-3 p-6 bg-red-100 rounded-xl font-mono overflow-y-auto overflow-x-clip">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {browse_page_state.summary}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="h-full w-full bg-slate-400"></div>
        </div>
        </div>
    );
}