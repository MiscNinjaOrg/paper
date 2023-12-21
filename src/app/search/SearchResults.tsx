import { useContext, KeyboardEvent, RefObject, useRef } from "react"
import { StateContext, DispatchContext } from "./Context"
import { TextareaAutosize } from "@mui/base";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function SearchBox({handleSearch, prevQuery}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>, prevQuery: string}) {

    const queryInput = useRef<HTMLTextAreaElement>(null);

    return (
        <TextareaAutosize 
        ref={queryInput}
        name="prompt"
        id="prompt"
        minRows={1}
        maxRows={4}
        onKeyDown={async (e: KeyboardEvent<HTMLTextAreaElement>) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch(queryInput);
            }
        }}
        className="bg-red-400 resize-none pl-6 pr-6 pt-3 pb-3 ml-4 mr-4 h-full w-1/3 rounded-full text-lg font-mono"
        placeholder="What's up?"
        defaultValue={prevQuery}
        />
    )
}

function SearchAnswer({answer}: {answer: string | null}) {
    return (
        <div className="w-4/6 mt-8 mb-4 p-6 bg-red-100 rounded-xl font-mono">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {answer}
            </ReactMarkdown>
        </div>
    )
}

function SearchSources({sources}: {sources: any}) {
    return (
         <div className="flex flex-col w-4/6 mt-4 mb-8 p-6 bg-slate-400 rounded-xl font-mono">
            {sources.map((source: any, i: number) => (
            // <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            //     {
            //     `[Source ${source.position}: ${source.title}](${source.link})
            //     ${source.snippet}` as string
            //     }
            // </ReactMarkdown>
            <div key={i} className="bg-green-100 my-2 p-4 rounded-lg">
                Source {source.position}: <br/>
                <a href={source.link} className="underline bg-blue-100 bg-opacity-0 hover:bg-opacity-100">
                    {source.title}
                </a>
                <div>
                    {source.snippet}
                </div>
            </div>
            ))}
        </div>
    )
}

export function SearchResults({handleSearch}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>}) {

    const state = useContext(StateContext);
    return (
        <div className="flex flex-col w-full h-full max-h-screen">
            <div className="bg-blue-200 h-[10%] flex justify-start items-center min-w-[400px] w-full">
                <SearchBox handleSearch={handleSearch} prevQuery={state.query as string}/> 
            </div>
            <div className="flex flex-col justify-start items-center w-full bg-green-100 h-full text-black overflow-y-scroll">
                <SearchAnswer answer={state.answer?.split("Sources:")[0].split("Source:")[0] as string} />
                <SearchSources sources={state.sources}/>
            </div>
        </div>
    )
}