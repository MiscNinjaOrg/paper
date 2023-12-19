"use client"
import { signIn } from 'next-auth/react';

export function LoginButton() {
    return (
        <button type="button" onClick={() => signIn()} className="mb-4 py-2 px-2 max-w-md flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
            Login
        </button>
    )
}