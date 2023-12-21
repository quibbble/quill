import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";
import { CodexBot, CodexLeft, CodexRight, CodexTop, CodexBotLeft, CodexBotRight, CodexTopRight, CodexTopLeft, BuildCodexColor } from "./Display";

export const Unit = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, hand, ...other } = props;

    return (
        <div key={ data.UUID } className={`p-[1px] w-full h-full box-border flex items-center justify-center rounded-sm text-zinc-800 ${ target ? `bg-${team}-900 cursor-pointer` : `bg-zinc-900` }`} { ...other }>
            <div className="w-full h-full flex items-center justify-center relative">
            <div className={`${ CodexTop } border-b-${ BuildCodexColor(data?.Codex[0]) }`}/>                
                <div className={`${ CodexBot } border-t-${ BuildCodexColor(data?.Codex[1]) }`}/>                
                <div className={`${ CodexLeft } border-r-${ BuildCodexColor(data?.Codex[2]) }`}/>                
                <div className={`${ CodexRight } border-l-${ BuildCodexColor(data?.Codex[3]) }`}/>                
                <div className={`${ CodexTopLeft } border-b-${ BuildCodexColor(data?.Codex[4]) }`}/>
                <div className={`${ CodexBotRight } border-b-${ BuildCodexColor(data?.Codex[5]) }`}/>
                <div className={`${ CodexBotLeft } border-b-${ BuildCodexColor(data?.Codex[6]) }`}/>                
                <div className={`${ CodexTopRight } border-b-${ BuildCodexColor(data?.Codex[7]) }`}/>

                <div className="w-full h-full flex flex-col items-center md:gap-1 justify-center font-bold leading-none text-3xs md:text-xs p-2">
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
