"use client"
import { LoginButton } from "./LoginButton"
import { SidebarLoggedIn, SidebarLoggedOut, SidebarNoAuth } from "../sidebar/Sidebar";
import { Chat } from "../chat/Chat";
import { useReducer } from "react";
import { UserContext, StateContext, DispatchContext } from "./Context";
import { Search } from "../search/Search";
import { Code } from "../code/Code";

// this state-action reducer is meant to handle switching between the apps in the sidebar - search, chat, code, etc.
export interface State {
    current_app: string;
}
  
export interface Actions {
    type: string;
    target_app: string;
}

function reducer (state: State, action: Actions): State {
    switch (action.type) {
        case "switch_app":
            return {
                ...state,
                current_app: action.target_app
            };
        default:
        return state;
    }
}

// for when deploying with next auth
export function HomeLoggedIn({userEmail, userImage, userName}: {userEmail: string | null | undefined, userImage: string | null | undefined, userName: string | null | undefined}) {
    const [state, dispatch] = useReducer(reducer, {
        current_app: "search"
    });

    const user = {
        email: userEmail,
        image: userImage,
        name: userName
    }

    const getCurrentApp = (app: string) => {
        switch (app) {
            case "search": return <Search />;
            case "chat": return <Chat />;
            case "code": return <Code />;
            default: return <Chat />;
        }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <UserContext.Provider value={user}>
                    <main className='flex'>
                        <SidebarLoggedIn />
                        { getCurrentApp(state.current_app) }
                    </main>
                </UserContext.Provider>
            </DispatchContext.Provider>
        </StateContext.Provider>

    )
}

// for when deploying locally with no auth required
export function HomeNoAuth() {
    const [state, dispatch] = useReducer(reducer, {
        current_app: "search"
    });

    const getCurrentApp = (app: string) => {
        switch (app) {
            case "search": return <Search />;
            case "chat": return <Chat />;
            case "code": return <Code />;
            default: return <Chat />;
        }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                    <main className='flex'>
                        <SidebarNoAuth />
                        { getCurrentApp(state.current_app) }
                    </main>
            </DispatchContext.Provider>
        </StateContext.Provider>

    ) 
}

// when deploying with auth but logged out
export function HomeLoggedOut() {
    return (
        <main className='flex'>
          <SidebarLoggedOut />
          <LoginButton />
        </main>
      )
}