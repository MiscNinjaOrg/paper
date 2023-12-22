import { SearchInitial } from "./SearchInitial";
import { SearchResults } from "./SearchResults";
import { StateContext, DispatchContext } from "./Context";
import { Dispatch, RefObject, useEffect, useReducer } from "react";
import { ConfigBar } from "./ConfigBar";

interface Dictionary<T> {
    [Key: string]: T;
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
export type Actions = UpdateInitial | UpdateRecs | UpdateModelProvider | UpdateModel | UpdateAPIKey | UpdateQuery | ClearAnswer | UpdateSources | UpdateAnswer | ToggleConfig;

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
        default:
            return state;
    }
}

export function Search() {

    let state_to_use: State;
    const local_search_state = sessionStorage.getItem('search_state');
    if (local_search_state !== 'undefined' && local_search_state && JSON.parse(local_search_state).initial === false) {
        state_to_use = JSON.parse(local_search_state);
    }
    else {
        state_to_use = {initial: true, recs: null, model_provider_name: "openai", model_name: "gpt-3.5-turbo", api_keys: {}, query: null, sources: null, answer: null, config_visible: false};
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

                // provider openai
                if (state.model_provider_name === "openai") {
                    let api_key: string;
                    if (typeof(state.api_keys["openai"] === "undefined")) {
                        api_key = "";
                    }
                    else {
                        api_key = state.api_keys["openai"];
                    }
 
                    if (state.model_name === "gpt-3.5-turbo") {
                       res = await fetch("/api/search/openai/gpt-3.5-turbo", {
                            method: "POST",
                            body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
                        });
                        data = res.body;
                    }
                    else if (state.model_name === "gpt-4") {
                        res = await fetch("/api/search/openai/gpt-4", {
                            method: "POST",
                            body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
                        });
                        data = res.body;
                    }
                }

                // provider openrouter
                else if (state.model_provider_name === "openrouter") {
                    let api_key: string;
                    if (typeof(state.api_keys["openrouter"] === "undefined")) {
                        api_key = "";
                    }
                    else {
                        api_key = state.api_keys["openrouter"];
                    }
                    if (state.model_name === "gpt-3.5-turbo") {
                        res = await fetch("/api/search/openrouter/gpt-3.5-turbo", {
                             method: "POST",
                             body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
                         });
                         data = res.body;
                    }
                    else if (state.model_name === "gpt-4") {
                        res = await fetch("/api/search/openrouter/gpt-4", {
                            method: "POST",
                            body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
                        });
                        data = res.body;
                    }
                    else if (state.model_name === "capybara-7b") {
                        res = await fetch("/api/search/openrouter/capybara-7b", {
                            method: "POST",
                            body: JSON.stringify({query: query, sources: serpResults, api_key: api_key})
                        });
                        data = res.body;
                    }
                    
                }

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

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <div className="flex w-full bg-red-100">
                    {state.initial ?
                    <SearchInitial handleSearch={handleSearch} getRecs={getRecs}/> : 
                    <SearchResults handleSearch={handleSearch}/>}
                    <ConfigBar />
                </div>
           </DispatchContext.Provider>
        </StateContext.Provider>
    )
}