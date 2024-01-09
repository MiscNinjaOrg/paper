"use client"
import { LoginButton } from "./LoginButton"
import { SidebarLoggedIn, SidebarLoggedOut, SidebarNoAuth } from "../sidebar/Sidebar";
import { Chat } from "../chat/Chat";
import { useReducer } from "react";
import { UserContext, StateContext, DispatchContext } from "./Context";
import { Search } from "../search/Search";
import { Code } from "../code/Code";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

// this state-action reducer is meant to handle switching between the apps in the sidebar - search, chat, code, etc.
export interface State {
    app: string;
    search_initial: boolean;
    dark: boolean;
    sidebar_visible: boolean;
}

type SwitchApp = {type: "switch_app", app: string};
type ToggleSearchInitial = {type: "toggle_search_initial", search_initial: boolean};
type ToggleDark = {type: "toggle_dark"};
type ToggleSidebar = {type: "toggle_sidebar"};
export type Actions = SwitchApp | ToggleDark | ToggleSidebar | ToggleSearchInitial;

function reducer (state: State, action: Actions): State {
    switch (action.type) {
        case "switch_app":
            if (state.app === "search" && action.app === "search" && !state.search_initial) {
                console.log("pungus");
                return {
                    ...state,
                    app: action.app,
                    search_initial: true
                }
            }
            return {
                ...state,
                app: action.app
            };
        case "toggle_search_initial":
            return {
                ...state,
                search_initial: action.search_initial
            };
        case "toggle_dark":
            return {
                ...state,
                dark: !state.dark
            };
        case "toggle_sidebar":
            return {
                ...state,
                sidebar_visible: !state.sidebar_visible
            };

        default:
            return state;
    }
}

// for when deploying with next auth
export function HomeLoggedIn({userEmail, userImage, userName}: {userEmail: string | null | undefined, userImage: string | null | undefined, userName: string | null | undefined}) {
    const [state, dispatch] = useReducer(reducer, {
        app: "search",
        search_initial: true,
        dark: false,
        sidebar_visible: false
    });

    const user = {
        email: userEmail,
        image: userImage,
        name: userName
    }

    const getCurrentApp = (app: string) => {
        switch (app) {
            case "search": return <Search initial={state.search_initial} />;
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
                        { getCurrentApp(state.app) }
                    </main>
                </UserContext.Provider>
            </DispatchContext.Provider>
        </StateContext.Provider>

    )
}

// for when deploying locally with no auth required
export function HomeNoAuth() {
    const [state, dispatch] = useReducer(reducer, {
        app: "search",
        search_initial: false,
        dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
        sidebar_visible: false
    });

    const getCurrentApp = (app: string) => {
        switch (app) {
            case "search": return <Search initial={state.search_initial} />;
            case "chat": return <Chat />;
            case "code": return <Code />;
            default: return <Chat />;
        }
    }

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserView>
                     <main className={`flex ${state.dark?`dark`:``}`}>
                        <SidebarNoAuth />
                        { getCurrentApp(state.app) }
                    </main>
                </BrowserView>
                <MobileView>
                    <main className={`fixed flex ${state.dark?`dark`:``}`}>
                        <div className="fixed flex">
                            <button className={`absolute z-10 transition-all ${state.sidebar_visible?`left-[100px]`:`left-0`}`} onClick={() => dispatch({type: "toggle_sidebar"})}>
                            <svg className={`w-12 aspect-square mt-4 ml-4 transition-all`} viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fffafa" stroke-width="1.75"> <path d="M5.5 11.75C5.08579 11.75 4.75 12.0858 4.75 12.5C4.75 12.9142 5.08579 13.25 5.5 13.25V11.75ZM19.5 13.25C19.9142 13.25 20.25 12.9142 20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75V13.25ZM7.834 15.75C7.41979 15.75 7.084 16.0858 7.084 16.5C7.084 16.9142 7.41979 17.25 7.834 17.25V15.75ZM17.167 17.25C17.5812 17.25 17.917 16.9142 17.917 16.5C17.917 16.0858 17.5812 15.75 17.167 15.75V17.25ZM7.834 7.75C7.41979 7.75 7.084 8.08579 7.084 8.5C7.084 8.91421 7.41979 9.25 7.834 9.25V7.75ZM17.167 9.25C17.5812 9.25 17.917 8.91421 17.917 8.5C17.917 8.08579 17.5812 7.75 17.167 7.75V9.25ZM5.5 13.25H19.5V11.75H5.5V13.25ZM7.834 17.25H17.167V15.75H7.834V17.25ZM7.834 9.25H17.167V7.75H7.834V9.25Z" fill="#000000"></path> </g><g id="SVGRepo_iconCarrier"> <path d="M5.5 11.75C5.08579 11.75 4.75 12.0858 4.75 12.5C4.75 12.9142 5.08579 13.25 5.5 13.25V11.75ZM19.5 13.25C19.9142 13.25 20.25 12.9142 20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75V13.25ZM7.834 15.75C7.41979 15.75 7.084 16.0858 7.084 16.5C7.084 16.9142 7.41979 17.25 7.834 17.25V15.75ZM17.167 17.25C17.5812 17.25 17.917 16.9142 17.917 16.5C17.917 16.0858 17.5812 15.75 17.167 15.75V17.25ZM7.834 7.75C7.41979 7.75 7.084 8.08579 7.084 8.5C7.084 8.91421 7.41979 9.25 7.834 9.25V7.75ZM17.167 9.25C17.5812 9.25 17.917 8.91421 17.917 8.5C17.917 8.08579 17.5812 7.75 17.167 7.75V9.25ZM5.5 13.25H19.5V11.75H5.5V13.25ZM7.834 17.25H17.167V15.75H7.834V17.25ZM7.834 9.25H17.167V7.75H7.834V9.25Z" fill="#000000"></path> </g></svg>
                            </button>
                            <div className={`fixed h-full items-center justify-start flex flex-col transition-all ${state.sidebar_visible ? "left-0" : "-left-[100px]"}`}>
                                {/* model name */}
                                <SidebarNoAuth/>
                            </div>
                        </div>
                        { getCurrentApp(state.app) }
                    </main>
                </MobileView>
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