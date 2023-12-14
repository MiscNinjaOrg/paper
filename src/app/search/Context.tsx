import { Dispatch, createContext } from "react";
import { State, Actions } from "./Search";

export const StateContext = createContext<State>({} as State);
export const DispatchContext = createContext<Dispatch<Actions>>({} as Dispatch<Actions>);