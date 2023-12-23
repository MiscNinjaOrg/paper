import { SearchInitial } from "./SearchInitial";
import { SearchResults } from "./SearchResults";
import { StateContext, DispatchContext } from "./Context";
import { RefObject, useEffect, useReducer } from "react";
import { ConfigBar } from "./ConfigBar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Browse } from "./Browse";
import { url } from "inspector";
import { SearchResult } from "../api/search/serp/route";

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface BrowsePageState {
    search_result: SearchResult;
    summary: string;
}

// this state-action reducer is supposed to handle the current state of the entire search app - including the current query (and whether or not we are on the initial screen), the current search results (both the sources and the answer being streamed)
export interface State {
    initial: boolean;
    recs: any | null;
    model_provider_name: string;
    model_name: string;
    api_keys: Dictionary<string>;
    query: string | null;
    sources: any | null;
    answer: string | null;
    config_visible: boolean;
    tab: string;
    browse_pages: BrowsePageState[];
}

type UpdateInitial = {type: "update_initial"};
type UpdateRecs = {type: "update_recs", recs: any};
type UpdateModelProvider = {type: "update_model_provider", model_provider_name: string};
type UpdateModel = {type: "update_model", model_name: string};
type UpdateAPIKey = {type: "update_api_key", provider: string, key: string}
type UpdateQuery = {type: "update_query", query: string};
type ClearAnswer = {type: "clear_answer"};
type UpdateSources = {type: "update_sources", sources: any};
type UpdateAnswer = {type: "update_answer", answer: string};
type ToggleConfig = {type: "toggle_config"};
type UpdateTab = {type: "update_tab", tab: string};
type CreateBrowsePage = {type: "create_browse_page", search_result: SearchResult};
type DeleteBrowsePage = {type: "delete_browse_page", index: number};
type UpdateBrowsePages = {type: "update_browse_pages", index: number, browse_page: BrowsePageState}
export type Actions = UpdateInitial | UpdateRecs | UpdateModelProvider | UpdateModel | UpdateAPIKey | UpdateQuery | ClearAnswer | UpdateSources | UpdateAnswer | ToggleConfig | UpdateTab | CreateBrowsePage | DeleteBrowsePage | UpdateBrowsePages;

function reducer(state:State, action: Actions): State {
    switch (action.type) {
        case "update_initial":
            return {
                ...state,
                initial: false
            };
        case "update_recs":
            return {
                ...state,
                recs: action.recs
            };
        case "update_model_provider":
            return {
                ...state,
                model_provider_name: action.model_provider_name
            };
        case "update_model":
            return {
                ...state,
                model_name: action.model_name
            };
        case "update_api_key":
            let keys = state.api_keys;
            keys[action.provider as string] = action.key;
            return {
                ...state,
                api_keys: keys
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
                answerUpdated = answerUpdated.replaceAll(`[${i}]`, `<span className="bg-blue-300 hover:bg-blue-500 text-xs p-1 rounded-xl"><a href="${state.sources[i-1].link}" target="_blank" rel="noopener noreferrer">Source ${i}</a></span>`);
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
        case "toggle_config":
            return {
                ...state,
                config_visible: !state.config_visible
            };
        case "update_tab":
            return {
                ...state,
                tab: action.tab
            };
        case "create_browse_page":
            return {
                ...state,
                browse_pages: [...state.browse_pages, {search_result: action.search_result, summary: ""} as BrowsePageState],
                tab: String(state.browse_pages.length + 1)
            }
        case "delete_browse_page":
            const pagesCopy = [...state.browse_pages];
            const removed = pagesCopy.splice(action.index, 1);
            return {
                ...state,
                browse_pages: pagesCopy,
                tab: String(Math.min(Number(state.tab), state.browse_pages.length - 1))
            };
        case "update_browse_pages":
            let browse_pages = state.browse_pages;
            browse_pages[action.index] = action.browse_page;
            return {
                ...state,
                browse_pages: browse_pages,
            };
        default:
            return state;
    }
}

export function Search() {

    let state_to_use: State;
    const local_search_state = sessionStorage.getItem('search_state');
    // if (local_search_state !== 'undefined' && local_search_state && JSON.parse(local_search_state).initial === false) {
    if (local_search_state !== 'undefined' && local_search_state) {
        state_to_use = JSON.parse(local_search_state);
    }
    else {
        state_to_use = {initial: true, recs: null, model_provider_name: "openai", model_name: "gpt-3.5-turbo", api_keys: {}, query: null, sources: null, answer: null, config_visible: false, tab: "0", browse_pages: []};
    }

    const [state, dispatch] = useReducer(reducer, state_to_use);

    useEffect(() => {
        sessionStorage.setItem("search_state", JSON.stringify(state));
    }, [state]);

    const handleSearch = async (ref: RefObject<HTMLTextAreaElement>) => {
        if (ref && ref.current) {
            const query = ref.current.value;
            if (query != "") {
                const serpResponse = await fetch("/api/search/serp", {
                    method: "POST",
                    body: JSON.stringify({query: query})
                });
                const serpResults = await serpResponse.json();

                dispatch({type: "update_sources", sources: serpResults});
                dispatch({type: "update_initial"});
                dispatch({type: "clear_answer"});
                dispatch({type: "update_query", query: query});

                let res: Response
                let data = null

                let api_key: string;
                if (typeof(state.api_keys[state.model_provider_name] === "undefined")) {
                    api_key = "";
                }
                else {
                    api_key = state.api_keys[state.model_provider_name];
                }
                res = await fetch(`/api/search/${state.model_provider_name}/${state.model_name}`, {
                    method: "POST",
                    body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
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
            }
        }
    }

    const getRecs = async () => {
        const recsResponse = await fetch("/api/search/recs", {
            method: "POST",
            body: JSON.stringify({query: "news"})
        });
        const recsResults = await recsResponse.json();
        dispatch({type: "update_recs", recs: recsResults});
    }

    const getSummary = async (index: number, link: string) => {

        const browse_page = state.browse_pages[index];
        dispatch({type: "update_browse_pages", index: index, browse_page: {search_result: browse_page.search_result, summary: ""} as BrowsePageState});

        let res: Response
        let data = null

        let api_key: string;
        if (typeof(state.api_keys[state.model_provider_name] === "undefined")) {
            api_key = "";
        }
        else {
            api_key = state.api_keys[state.model_provider_name];
        }
        res = await fetch(`/api/summary/${state.model_provider_name}/${state.model_name}`, {
            method: "POST",
            body: JSON.stringify({link: link})
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
            const browse_page = state.browse_pages[index];
            dispatch({type: "update_browse_pages", index: index, browse_page: {search_result: browse_page.search_result, summary: browse_page.summary + chunkValue} as BrowsePageState});
        }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                    <Tabs className="w-full bg-green-200" selectedIndex={Number(state.tab)}>
                        <TabList className="flex justify-start items-center h-[40px] text-black">
                            <Tab className="flex justify-center items-center w-[250px] border-r-[1px] border-black h-full focus:outline-0">
                                <button onClick={() => {dispatch({type: "update_tab", tab: "0"})}} className="flex justify-center items-center hover:bg-yellow-100 h-full w-full px-4 truncate">Search</button>
                            </Tab>
                            {
                                state.browse_pages.map((page: BrowsePageState, i: number) => (
                                    <Tab key={i} className="flex justify-center items-center w-[250px] border-r-[1px] border-black h-full focus:outline-0">
                                        <button onClick={() => {console.log(i); dispatch({type: "update_tab", tab: String(i+1)})}} className="flex justify-center items-center hover:bg-yellow-100 h-full w-full px-4 truncate">
                                            <p className="truncate">{page.search_result.title}</p>
                                        </button>
                                        <button onClick={() => {console.log(i); dispatch({type: "delete_browse_page", index: i})}} className="py-2 px-4 hover:bg-yellow-100">X</button>
                                    </Tab>
                                ))
                            }
                        </TabList>

                        <TabPanel className="bg-red-100">
                            <div className="flex h-[calc(100vh_-_40px)]">
                            {state.initial ?
                            <SearchInitial handleSearch={handleSearch} getRecs={getRecs}/> : 
                            <SearchResults handleSearch={handleSearch}/>}
                            <ConfigBar />
                            </div>
                        </TabPanel>
                        {
                            state.browse_pages.map((page: BrowsePageState, i: number) => (
                                <TabPanel key={i}>
                                    <div className="h-[calc(100vh_-_40px)]">
                                        <Browse index={i} browse_page_state={page} getSummary={getSummary}/>
                                    </div>
                                </TabPanel>
                            ))
                        }
                   </Tabs>
           </DispatchContext.Provider>
        </StateContext.Provider>
    )
}