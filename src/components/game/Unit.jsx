import React, { useEffect, useState, forwardRef, useCallback } from "react";

export const Unit = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, ...other } = props;

    const top = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 top-0"
    const bot = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-b-0 bottom-0"
    const left = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-l-0 left-0"
    const right = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-r-0 right-0"
    const topLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-45 top-0 left-[-3px]"
    const topRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-45 top-0 right-[-3px]"
    const botLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-[135deg] bottom-0 left-[-3px]"
    const botRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-[135deg] bottom-0 right-[-3px]"

    const color = (code) => code == "1" ? data.Cooldown == 0 && data.Movement > 0 ? "zinc-100" :  data.Cooldown == 0 ? "amber-500" : data.Movement > 0 ? "lime-500" : "zinc-800" : `${ team }-600`

    return (
        <div key={ data.UUID } className={`p-[1px] w-full h-full box-border flex items-center justify-center rounded-sm text-zinc-800 ${ target ? `bg-${ team }-400 cursor-pointer` : `bg-${ team }-500` }`} { ...other }>
            <div className="w-full h-full flex items-center justify-center relative">
                <div className={`${ top } border-b-${ color(data?.Codex[0]) }`}/>                
                <div className={`${ bot } border-t-${ color(data?.Codex[1]) }`}/>                
                <div className={`${ left } border-r-${ color(data?.Codex[2]) }`}/>                
                <div className={`${ right } border-l-${ color(data?.Codex[3]) }`}/>                
                <div className={`${ topLeft } border-b-${ color(data?.Codex[4]) }`}/>
                <div className={`${ botRight } border-b-${ color(data?.Codex[5]) }`}/>
                <div className={`${ botLeft } border-b-${ color(data?.Codex[6]) }`}/>                
                <div className={`${ topRight } border-b-${ color(data?.Codex[7]) }`}/>

                <div className="w-full h-full flex flex-col items-center justify-center text-2xl font-bold leading-none">
                    <p className="text-base">{ data?.Init.ID.toLowerCase() }</p>
                    <div className="flex gap-1">
                        <p>{data?.Attack < 0 ? 0 : data?.Attack}</p>
                        <p>{data?.Cooldown < 0 ? 0 : data?.Cooldown}</p>
                        <p>{data?.Health < 0 ? 0 : data?.Health}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})
