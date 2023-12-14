import { Dispatch, createContext } from "react";
import { User } from "../page";
import { State, Actions } from "./Home";

export const UserContext = createContext<User>({} as User);
export const StateContext = createContext<State>({} as State);
export const DispatchContext = createContext<Dispatch<Actions>>({} as Dispatch<Actions>);