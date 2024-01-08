import { TextareaAutosize } from "@mui/base";
import { RefObject, useRef, KeyboardEvent, useContext } from "react";
import { DispatchContext, StateContext } from "./Context";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

export function SearchBox({handleSearch}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>}) {

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
        className="bg-slate-100 dark:bg-slate-600 border-4 border-theme-200  focus:border-theme-400 focus:outline-theme-400 focus:shadow-lg focus:shadow-theme-400 resize-none pl-6 pr-6 pt-3 pb-3 ml-4 mr-4 h-full w-full rounded-full text-lg font-mono"
        placeholder="What's up?"
        defaultValue=""
        />
    )
}

export function SearchInitial({handleSearch, getRecs}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>, getRecs: () => Promise<void>}) {

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext)
    if (state.recs === null) {
        getRecs();
    }

    return (
        <div className="flex flex-col justify-evenly items-center w-full max-h-screen bg-white dark:bg-slate-800">
            <div className="min-h-[80px] h-[20%] aspect-square mt-20 mb-20">
                <svg fill="#000000" className="dark:fill-white dark:stroke-white" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M145.067,136.542h102.4c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533h-102.4 c-4.719,0-8.533,3.823-8.533,8.533S140.348,136.542,145.067,136.542z"></path> <path d="M196.267,273.075H128c-4.719,0-8.533,3.823-8.533,8.533c0,4.71,3.814,8.533,8.533,8.533h68.267 c4.719,0,8.533-3.823,8.533-8.533C204.8,276.898,200.986,273.075,196.267,273.075z"></path> <path d="M170.667,230.409c0-4.71-3.814-8.533-8.533-8.533h-51.2c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533h51.2 C166.852,238.942,170.667,235.119,170.667,230.409z"></path> <path d="M110.933,187.742H230.4c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533H110.933 c-4.719,0-8.533,3.823-8.533,8.533C102.4,183.919,106.214,187.742,110.933,187.742z"></path> <path d="M264.533,273.075H230.4c-4.719,0-8.533,3.823-8.533,8.533c0,4.71,3.814,8.533,8.533,8.533h34.133 c4.719,0,8.533-3.823,8.533-8.533C273.067,276.898,269.252,273.075,264.533,273.075z"></path> <path d="M386.313,338.057c-3.328,3.328-3.328,8.738,0,12.066l18.108,18.108c1.664,1.673,3.849,2.5,6.033,2.5 c2.176,0,4.361-0.828,6.033-2.5c3.328-3.328,3.328-8.73,0-12.066l-18.099-18.108 C395.051,334.729,389.649,334.729,386.313,338.057z"></path> <path d="M499.499,439.177l-59.802-59.793c-1.596-1.604-3.763-2.5-6.033-2.5h-0.008c-2.261,0-4.437,0.905-6.042,2.509 l-24.064,24.201c-3.328,3.345-3.311,8.738,0.034,12.066c3.354,3.328,8.747,3.319,12.066-0.034l18.031-18.125l53.751,53.743 c4.83,4.838,7.501,11.264,7.501,18.099s-2.671,13.269-7.501,18.099c-9.975,9.975-26.206,9.992-36.198,0.009l-101.12-101.12 c-3.328-3.328-8.73-3.328-12.066,0c-3.328,3.337-3.328,8.738,0,12.075l101.12,101.111c8.311,8.32,19.234,12.476,30.157,12.476 s21.862-4.164,30.174-12.476c8.055-8.064,12.501-18.773,12.501-30.174C512,457.95,507.554,447.232,499.499,439.177z"></path> <path d="M409.6,204.809c0-112.922-91.878-204.8-204.8-204.8S0,91.887,0,204.809s91.878,204.8,204.8,204.8 S409.6,317.73,409.6,204.809z M204.8,392.542c-103.518,0-187.733-84.215-187.733-187.733S101.282,17.075,204.8,17.075 s187.733,84.215,187.733,187.733S308.318,392.542,204.8,392.542z"></path> <path d="M204.8,34.142c-94.106,0-170.667,76.561-170.667,170.667S110.694,375.475,204.8,375.475s170.667-76.561,170.667-170.667 S298.906,34.142,204.8,34.142z M204.8,358.409c-84.693,0-153.6-68.907-153.6-153.6s68.907-153.6,153.6-153.6 s153.6,68.907,153.6,153.6S289.493,358.409,204.8,358.409z"></path> <path d="M298.667,221.875h-102.4c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533h102.4 c4.719,0,8.533-3.823,8.533-8.533S303.386,221.875,298.667,221.875z"></path> <path d="M298.667,170.675h-34.133c-4.719,0-8.533,3.823-8.533,8.533c0,4.71,3.814,8.533,8.533,8.533h34.133 c4.719,0,8.533-3.823,8.533-8.533C307.2,174.498,303.386,170.675,298.667,170.675z"></path> </g> </g> </g> </g></svg>
            </div>
            <div className="h-[20%] flex justify-center items-center min-w-[400px] w-[50%]">
                <SearchBox handleSearch={handleSearch}/>
            </div>
            {state.recs?
            <div className="flex flex-wrap justify-center py-4 bg-theme-50 dark:bg-theme-700 rounded-lg border-2 border-theme-400 h-full w-1/2 min-w-[400px] mt-20 mb-20 font-mono overflow-y-scroll no-scrollbar">
                {state.recs.map((rec: any, i: number) => (
                    <div key={i} className={`flex flex-col bg-slate-100 dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-400 my-2 mx-2 p-4 rounded-lg ${isMobile?`w-[90%]`:`w-[45%]`}`}>
                        <a href={rec.link} target="_blank" rel="noopener noreferrer" className="underline bg-transparent hover:bg-theme-100 dark:hover:bg-theme-700">
                            {rec.title}
                        </a>
                        <div className="grow">
                            {rec.snippet}
                        </div>
                    </div>
                ))}
            </div>
            :
            <div className="flex flex-wrap h-full w-1/2 min-w-[400px] mt-20 mb-20"></div>
            }
        </div>
    );
}