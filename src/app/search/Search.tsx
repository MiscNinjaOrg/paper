import { SearchInitial } from "./SearchInitial";
import { StateContext, DispatchContext } from "./Context";
import { RefObject, useReducer } from "react";

export interface State {
    initial: boolean;
    query: string | null;
    results: [] | null;
}

type UpdateInitial = {type: "update_initial"};
type UpdateQuery = {type: "update_query", query: string};
type UpdateResults = {type: "update_results", results: []};
export type Actions = UpdateInitial | UpdateQuery | UpdateResults;

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
        case "update_results":
            return {
                ...state,
                results: action.results
            };
        default:
            return state;
    }
}



export function Search() {

    const [state, dispatch] = useReducer(reducer, {initial: true, query: null, results: null});

    const handleSearch = async (ref: RefObject<HTMLTextAreaElement>) => {
            if (ref && ref.current) {
                const query = ref.current.value;
                if (query != "") {
                    dispatch({type: "update_initial"});
                    dispatch({type: "update_query", query: query});
                }
            }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {state.initial ? 
                <SearchInitial handleSearch={handleSearch}/> : 
                <div>owo</div>}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}