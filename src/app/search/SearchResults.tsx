import { useContext, KeyboardEvent, RefObject, useRef } from "react"
import { StateContext, DispatchContext } from "./Context"
import { TextareaAutosize } from "@mui/base";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function SearchBox({handleSearch, prevQuery, search_disabled}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>, prevQuery: string, search_disabled: boolean}) {

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
        className="bg-slate-200 dark:bg-slate-600 border-2 border-theme-200 focus:border-theme-400 focus:outline-theme-400 focus:shadow-lg focus:shadow-theme-400 resize-none pl-6 pr-6 pt-3 pb-3 ml-4 mr-4 h-full w-1/3 rounded-full text-lg font-mono"
        placeholder="What's up?"
        defaultValue={prevQuery}
        disabled={search_disabled}
        />
    )
}

function SearchAnswer({answer}: {answer: string | null}) {
    return (
        <div className="w-full mt-8 mb-4 p-6 bg-slate-50 dark:bg-slate-600 border-4 border-theme-400 rounded-xl font-mono shadow-lg shadow-theme-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {answer}
            </ReactMarkdown>
        </div>
    )
}

function SearchSources({sources}: {sources: any}) {

    const dispatch = useContext(DispatchContext);

    return (
         <div className="flex flex-col w-full mt-4 mb-8 p-6 bg-theme-50 dark:bg-theme-700 border-2 border-slate-400 rounded-xl font-mono">
            {sources.map((source: any, i: number) => (
            // <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            //     {
            //     `[Source ${source.position}: ${source.title}](${source.link})
            //     ${source.snippet}` as string
            //     }
            // </ReactMarkdown>
            <div key={i} className="bg-slate-100 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500 my-2 p-4 rounded-lg">
                Source {i+1}: <br/>
                <a href={source.link} target="_blank" rel="noopener noreferrer" className="underline bg-transparent hover:bg-theme-100 dark:hover:bg-theme-700">
                    {source.title}
                </a>
                <div>
                    {source.snippet}
                </div>
                {/* <button onClick={() => {dispatch({type: "create_browse_page", search_result: source})}} className="min-w-[400px] flex justify-center items-center bg-red-100 mt-8 py-2 rounded-lg">
                    Open with MiscNinja
                </button> */}
            </div>
            ))}
        </div>
    )
}

function Images({images}: {images: any}) {
    return (
        <div className="flex flex-col justify-start bg-slate-50 dark:bg-slate-600 border-2 pt-4 pb-4 border-theme-400 rounded-md items-center w-full h-[650px] font-mono text-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    Images
            </ReactMarkdown> 
            <div className="flex justify-evenly items-center h-[50%] w-full">
                <a href={images[0].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[90%] max-w-[60%] hover:scale-110 transition-all overflow-clip aspect-square border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                <img src={images[0].imageURL} className="object-cover h-full w-full rounded-md"></img>
                </a>
                <div className="flex flex-col w-[30%] h-full justify-evenly items-center">
                    <a href={images[5].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[40%] max-w-[90%] hover:scale-110 transition-all overflow-clip aspect-square border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                        <img src={images[5].imageURL} className="object-cover h-full w-full rounded-md"/>
                    </a>
                    <a href={images[6].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[40%] max-w-[90%] hover:scale-110 transition-all overflow-clip aspect-square border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                        <img src={images[6].imageURL} className="object-cover h-full w-full rounded-md"/>
                    </a>
                </div>
            </div>
            <div className="flex justify-evenly items-center h-[25%] w-full">
                <a href={images[1].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[90%] max-w-[40%] hover:scale-110 transition-all overflow-clip border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                    <img src={images[1].imageURL} className="object-cover h-full w-full rounded-md"/>
                </a>
                <a href={images[2].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[90%] max-w-[40%] hover:scale-110 transition-all overflow-clip border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                    <img src={images[2].imageURL} className="object-cover h-full w-full rounded-md"/>
                </a>
            </div>
            <div className="flex justify-evenly items-center h-[25%] w-full">
                <a href={images[3].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[90%] max-w-[40%] hover:scale-110 transition-all overflow-clip border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                    <img src={images[3].imageURL} className="object-cover h-full w-full rounded-md"/>
                </a>
                <a href={images[4].imageLink} target="_blank" rel="noopener noreferrer" className="max-h-[90%] max-w-[40%] hover:scale-110 transition-all overflow-clip border-2 border-theme-400 rounded-lg shadow-lg shadow-theme-200">
                    <img src={images[4].imageURL} className="object-cover h-full w-full rounded-md"/>
                </a>
            </div>
        </div>
    )
}

export function SearchResults({handleSearch}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>}) {

    const state = useContext(StateContext);
    return (
        <div className="flex flex-col w-full h-full max-h-screen">
            <div className="bg-slate-100 dark:bg-slate-500 border-b-2 border-slate-400 h-[10%] min-h-[90px] flex justify-start items-center min-w-[400px] w-full">
                <SearchBox handleSearch={handleSearch} prevQuery={state.query as string} search_disabled={state.search_disabled}/> 
            </div>
            <div className="flex w-full h-full justify-center items-center bg-white dark:bg-slate-800 overflow-y-scroll">
                <div className="flex flex-col justify-start items-center w-full h-full px-10">
                    <SearchAnswer answer={state.answer?.split("Sources:")[0].split("Source:")[0] as string} />
                    {
                        state.sources?
                        <SearchSources sources={state.sources}/>
                        :<></>
                    }
                </div>
                <div className="flex flex-col justify-start items-center h-full w-[40%] p-8">
                    {
                        state.images?
                        <Images images={state.images} />
                        :<></>
                    }
                </div>
            </div>
        </div>
    )
}