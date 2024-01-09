import { SearchInitial } from "./SearchInitial";
import { SearchResults } from "./SearchResults";
import { StateContext, DispatchContext } from "./Context";
import { StateContext as AppStateContext, DispatchContext as AppDispatchContext} from "../home/Context";
import { RefObject, useContext, useEffect, useReducer } from "react";
import { ConfigBar } from "./ConfigBar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface SearchResult {
    link: string;
    title: string;
    snippet: string;
}

interface ImageResult {
    imageURL: string;
    imageLink: string;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

// export interface BrowsePageState {
//     search_result: SearchResult;
//     summary: string | null;
// }

// this state-action reducer is supposed to handle the current state of the entire search app - including the current query (and whether or not we are on the initial screen), the current search results (both the sources and the answer being streamed)
export interface State {
    // initial: boolean;
    recs: any | null;
    model: string;
    query: string | null;
    sources: any | null;
    images: any | null;
    answer: string | null;
    config_visible: boolean;
    search_disabled: boolean;
}

type UpdateInitial = {type: "update_initial"};
type UpdateRecs = {type: "update_recs", recs: any};
type UpdateModel = {type: "update_model", model: string};
type UpdateQuery = {type: "update_query", query: string};
type ClearAnswer = {type: "clear_answer"};
type UpdateSources = {type: "update_sources", sources: any};
type UpdateImages = {type: "update_images", images: any};
type UpdateAnswer = {type: "update_answer", answer: string};
type ToggleConfig = {type: "toggle_config"};
type ToggleSearchDisabled = {type: "toggle_search_disabled", disabled: boolean};
export type Actions = UpdateInitial | UpdateRecs | UpdateModel | UpdateQuery | ClearAnswer | UpdateSources | UpdateImages | UpdateAnswer | ToggleConfig | ToggleSearchDisabled;

function reducer(state:State, action: Actions): State {
    switch (action.type) {
        // case "update_initial":
        //     return {
        //         ...state,
        //         initial: false
        //     };
        case "update_recs":
            return {
                ...state,
                recs: action.recs
            };
        case "update_model":
            return {
                ...state,
                model: action.model
            };
        case "update_query":
            return {
                ...state,
                query: action.query
            };
        case "clear_answer":
            return {
                ...state,
                answer: ""
            };
        case "update_answer":
            let answerUpdated = String(state.answer) + action.answer;
            for (let i = 1; i <= state.sources.length; i++) {
                answerUpdated = answerUpdated.replaceAll(`[${i}]`, `<span className="bg-theme-300 dark:bg-theme-500 dark:hover:bg-theme-700 hover:bg-theme-500 text-xs p-1 rounded-xl"><a href="${state.sources[i-1].link}" target="_blank" rel="noopener noreferrer">Source ${i}</a></span>`);
            }
            answerUpdated = answerUpdated.split("Sources: ")[0]
            return {
                ...state,
                answer: answerUpdated
            };
        case "update_sources":
            return {
                ...state,
                sources: action.sources
            };
        case "update_images":
            return {
                ...state,
                images: action.images
            };
        case "toggle_config":
            return {
                ...state,
                config_visible: !state.config_visible
            };
        case "toggle_search_disabled":
            return {
                ...state,
                search_disabled: action.disabled
            };
        default:
            return state;
    }
}

export function Search({initial}: {initial:boolean}) {

    let state_to_use: State;
    const local_search_state = sessionStorage.getItem('search_state');
    // if (local_search_state !== 'undefined' && local_search_state && JSON.parse(local_search_state).initial === false) {
    if (local_search_state !== 'undefined' && local_search_state) {
        state_to_use = JSON.parse(local_search_state);
    }
    else {
        // state_to_use = {initial: true, recs: null, model_provider_name: "openai", model: "gpt-3.5-turbo", api_keys: {}, query: null, sources: null, answer: null, config_visible: false, tab: "0", browse_pages: []};
        state_to_use = {recs: null, model: "gpt-3.5-turbo", query: null, sources: null, images: null, answer: null, config_visible: false, search_disabled: false};
    }

    const [state, dispatch] = useReducer(reducer, state_to_use);
    const appState = useContext(AppStateContext);
    const appDispatch = useContext(AppDispatchContext);

    useEffect(() => {
        sessionStorage.setItem("search_state", JSON.stringify(state));
    }, [state]);

    const handleSearch = async (ref: RefObject<HTMLTextAreaElement>) => {
        if (ref && ref.current) {
            const query = ref.current.value;
            if (query != "") {
                // dispatch({type: "update_initial"});
                appDispatch({type: "toggle_search_initial", search_initial: false});
                dispatch({type: "clear_answer"});
                dispatch({type: "update_query", query: query});
                dispatch({type: "update_sources", sources: null});
                dispatch({type: "update_images", images: null});
                dispatch({type: "toggle_search_disabled", disabled: true});
                const serpResponse = await fetch(`${process.env.API}/serp/serp`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({query: query})
                });
                const serpResults = await serpResponse.json();

                const imagesResponse = await fetch(`${process.env.API}/serp/images`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({query: query})
                });
                const images = await imagesResponse.json();

                dispatch({type: "update_sources", sources: serpResults});
                dispatch({type: "update_images", images: images});
                dispatch({type: "clear_answer"});

                let res: Response
                let data = null

                res = await fetch(`${process.env.API}/search/${state.model}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({query: query, sources: serpResults})
                });
                data = res.body;

                if (!data) {
                    return;
                }

                const reader = data.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const {value, done: doneReading} = await reader.read();
                    done  = doneReading;
                    const chunkValue = decoder.decode(value);
                    dispatch({type: "update_answer", answer: chunkValue});
                }
                dispatch({type: "toggle_search_disabled", disabled: false});
            }
        }
    }

    const getRecs = async () => {
        const recsResponse = await fetch(`${process.env.API}/serp/news`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({query: "news"})
        });
        const recsResults = await recsResponse.json();
        dispatch({type: "update_recs", recs: recsResults});
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                   <div className="flex w-full text-black dark:text-white">
                    {initial ?
                    <SearchInitial handleSearch={handleSearch} getRecs={getRecs}/> : 
                    <SearchResults handleSearch={handleSearch}/>}
                    <ConfigBar />
                    </div>
           </DispatchContext.Provider>
        </StateContext.Provider>
    )
}