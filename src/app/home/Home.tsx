"use client"
import { LoginButton } from "./LoginButton"
import { SidebarLoggedIn, SidebarLoggedOut } from "../sidebar/Sidebar";
import { Chat } from "../chat/Chat";
import { useReducer } from "react";
import { UserContext, StateContext, DispatchContext } from "./Context";
import { Search } from "../search/Search";
import { Code } from "../code/Code";

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

export function HomeLoggedOut() {
    return (
        <main className='flex'>
          <SidebarLoggedOut />
          <LoginButton />
        </main>
      )
}