"use client"
import { SearchButton, ChatButton, CodeButton, LogoutButton } from './Buttons';
import { useContext } from 'react';
import { DispatchContext, StateContext, UserContext } from '../home/Context';

function AppIcon() {
    return (
        <button type="button" className="flex justify-center items-center p-2 pt-2 pb-2 border-slate-400 border-b-2 h-[90px] w-full">
        {/* <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" fill="#050D42"></path><path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" fill="#050D42"></path><path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" fill="#050D42"></path><path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" fill="#2F4BFF"></path></g></svg> */}
        <img src='logo.png'></img>
        </button>
    )
}

// for when deploying with next auth - usercontext gives us the user details
export function SidebarLoggedIn() {

    const user = useContext(UserContext);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex h-screen w-[100px] flex-col justify-between items-center bg-blue-200">
            <div className="flex-auto justify-center items-center bg-green-600 w-full">
                <AppIcon />
                <SearchButton onClick={() => {dispatch({type: "switch_app", app: "search"})}}/>
                <ChatButton onClick={() => {dispatch({type: "switch_app", app: "chat"})}}/>
                <CodeButton onClick={() => {dispatch({type: "switch_app", app: "code"})}}/>
            </div>
            <div>
                <img className='rounded-full' src={user.image as string} alt='user'/>
            </div>
            <div>
                <LogoutButton />
            </div>
        </div>
    )
}

// for when deploying locally with no auth required
export function SidebarNoAuth() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-500 border-r-2 border-slate-400 w-[100px] flex-col justify-between items-center">
            <div className="flex-auto justify-center items-center w-full">
                <AppIcon />
                <SearchButton onClick={() => {dispatch({type: "switch_app", app: "search"})}}/>
                <ChatButton onClick={() => {dispatch({type: "switch_app", app: "chat"})}}/>
                <CodeButton onClick={() => {dispatch({type: "switch_app", app: "code"})}}/>
            </div>
            <button className='w-[40px] h-[40px] mb-6' onClick={() => {dispatch({type: "toggle_dark"})}}>
            <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="5" stroke="#1C274C" stroke-width="1.5"></circle> <path d="M12 2V4" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 20V22" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 12L2 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12L20 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.7778 4.22266L17.5558 6.25424" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4.22217 4.22266L6.44418 6.25424" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M6.44434 17.5557L4.22211 19.7779" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.7778 19.7773L17.5558 17.5551" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            </button>
        </div>
    )
}

// when deploying with auth but logged out
export function SidebarLoggedOut() {
    return (
        <div className="flex h-screen w-[100px] flex-col justify-between items-center bg-blue-200">
            <div className="flex-auto justify-center items-center bg-green-600 w-full">
                <AppIcon />
            </div>
        </div>
    )
}