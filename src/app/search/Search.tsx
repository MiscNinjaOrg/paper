import { SearchInitial } from "./SearchInitial";
import { SearchResults } from "./SearchResults";
import { StateContext, DispatchContext } from "./Context";
import { RefObject, useReducer } from "react";

export interface State {
    initial: boolean;
    query: string | null;
    sources: any | null;
    answer: string | null;
}

type UpdateInitial = {type: "update_initial"};
type UpdateQuery = {type: "update_query", query: string};
type ClearAnswer = {type: "clear_answer"};
type UpdateSources = {type: "update_sources", sources: any};
type UpdateAnswer = {type: "update_answer", answer: string};
export type Actions = UpdateInitial | UpdateQuery | ClearAnswer | UpdateSources | UpdateAnswer;

function reducer(state:State, action: Actions): State {
    switch (action.type) {
        case "update_initial":
            return {
                ...state,
                initial: false
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
                answerUpdated = answerUpdated.replaceAll(`[${i}]`, `<span className="bg-blue-300 hover:bg-blue-500"><a href="${state.sources[i-1].link}" target="_blank" rel="noopener noreferrer">Source ${i}</a></span>`);
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
        default:
            return state;
    }
}

export function Search() {

    const [state, dispatch] = useReducer(reducer, {initial: true, query: null, sources: null, answer: null});

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

                    const res = await fetch("/api/search/openai", {
                        method: "POST",
                        body: JSON.stringify({query: query, sources: serpResults})
                    });
                    const data = res.body;
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

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {state.initial ?
                <SearchInitial handleSearch={handleSearch}/> : 
                <SearchResults handleSearch={handleSearch}/>}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}