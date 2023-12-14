import { createContext, Dispatch } from 'react';
import { State, Actions } from './Chat';

export const StateContext = createContext<State>({} as State);
export const DispatchContext = createContext<Dispatch<Actions>>({} as Dispatch<Actions>);