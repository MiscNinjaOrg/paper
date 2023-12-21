"use client"
import { TextareaAutosize } from "@mui/base";
import { RefObject, useRef, KeyboardEvent } from "react";

export function SearchBox({handleSearch}: {handleSearch: (ref: RefObject<HTMLTextAreaElement>) => Promise<void>}) {

    const queryInput = useRef<HTMLTextAreaElement>(null);

    return (
        <TextareaAutosize 
        ref={queryInput}
        name="prompt"
        id="prompt"
        minRows={1}
        maxRows={4}
        onKeyDown={async (e: KeyboardEvent<HTMLTextAreaElement>) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch(queryInput);
            }
        }}
        className="bg-red-400 resize-none pl-6 pr-6 pt-3 pb-3 ml-4 mr-4 h-full w-full rounded-full text-lg font-mono"
        placeholder="What's up?"
        defaultValue=""
        />
    )
}