import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";

export const Unit = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, hand, ...other } = props;

    const top = "absolute block w-0 h-0 border-4 border-solid border-transparent border-t-0 top-0"
    const bot = "absolute block w-0 h-0 border-4 border-solid border-transparent border-b-0 bottom-0"
    const left = "absolute block w-0 h-0 border-4 border-solid border-transparent border-l-0 left-0"
    const right = "absolute block w-0 h-0 border-4 border-solid border-transparent border-r-0 right-0"
    const topLeft = "absolute block w-0 h-0 border-4 border-solid border-transparent border-t-0 -rotate-45 top-0 left-[-2px]"
    const topRight = "absolute block w-0 h-0 border-4 border-solid border-transparent border-t-0 rotate-45 top-0 right-[-2px]"
    const botLeft = "absolute block w-0 h-0 border-4 border-solid border-transparent border-t-0 -rotate-[135deg] bottom-0 left-[-2px]"
    const botRight = "absolute block w-0 h-0 border-4 border-solid border-transparent border-t-0 rotate-[135deg] bottom-0 right-[-2px]"

    const color = (code) => code == "1" ? (data.Cooldown == 0 || data.Movement > 0) && !hand ? `${ team }-500` : `zinc-100` : `zinc-600`

    return (
        <div key={ data.UUID } className={`p-[1px] w-full h-full box-border flex items-center justify-center rounded-sm text-zinc-800 ${ target ? `bg-${team}-900 cursor-pointer` : `bg-zinc-900` }`} { ...other }>
            <div className="w-full h-full flex items-center justify-center relative">
                <div className={`${ top } border-b-${ color(data?.Codex[0]) }`}/>                
                <div className={`${ bot } border-t-${ color(data?.Codex[1]) }`}/>                
                <div className={`${ left } border-r-${ color(data?.Codex[2]) }`}/>                
                <div className={`${ right } border-l-${ color(data?.Codex[3]) }`}/>                
                <div className={`${ topLeft } border-b-${ color(data?.Codex[4]) }`}/>
                <div className={`${ botRight } border-b-${ color(data?.Codex[5]) }`}/>
                <div className={`${ botLeft } border-b-${ color(data?.Codex[6]) }`}/>                
                <div className={`${ topRight } border-b-${ color(data?.Codex[7]) }`}/>

                <div className="w-full h-full flex flex-col items-center md:gap-2 justify-center font-bold leading-none text-3xs md:text-xs p-2">
                    {
                        hand ?
                            <p className={`self-start flex items-center justify-center ${ data.Cost > data.Init.Cost ? "text-green-500" : data.Cost < data.Init.Cost ? "text-red-500" : "text-zinc-100" }`}><LuDroplet className="text-blue-500" /> { data.Cost }</p>
                            : null
                    }
                    <p className={`${target ? `text-${ team }-100` : `text-${ team }-500`}`}>{ data?.Init.Name }</p>
                    <div className="flex items-center justify-center font-bold w-full text-zinc-100">
                        <p className={`flex items-center justify-center ${ data?.Attack > data?.Init.Attack ? "text-green-500" : data?.Attack < data?.Init.Attack ? "text-red-500" : "" }`}><LuSword className="text-red-500" /> { data?.Attack }</p>
                        <p className={`flex items-center justify-center ${ data?.Cooldown > data?.Init.Cooldown ? "text-red-500" : data?.Cooldown < data?.Init.Cooldown ? "text-green-500" : "" }`}><LuHourglass className="text-amber-500" /> { data?.Cooldown > 0 ? data?.Cooldown : 0 }</p>
                        <p className={`flex items-center justify-center ${ data?.Health > data?.Init.Health ? "text-green-500" : data?.Health < data?.Init.Health ? "text-red-500" : "" }`}><LuHeart className="text-green-500" /> { data?.Health }</p>
                    </div>
                </div>
            </div>
        </div>
    )
})
