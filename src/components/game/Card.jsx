import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { Unit } from "./Unit";
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";

export const Card = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, ...other } = props;

    return (
        <>
        {
            data && data.Init ? 
                <div key={ data.UUID } className={`w-full h-full flex box-border items-center justify-center rounded-sm ${ target ? `bg-${team}-900 cursor-pointer` : `bg-zinc-900` }`} { ...other }>
                { 
                    data.Init.ID[0] == "U" ? 
                        <Unit hand={ true } {...props} /> :
                        <div className="font-bold flex flex-col items-start justify-center w-full p-2 text-3xs md:text-xs">
                            <p className={`flex items-center justify-center ${ data.Cost > data.Init.Cost ? "text-green-500" : data.Cost < data.Init.Cost ? "text-red-500" : "" }`}><LuDroplet className="text-blue-500" /> { data.Cost }</p>
                            <div className={`${target ? `text-${ team }-100` : `text-${ team }-500`} flex`}>{ data.Init.Name }</div> 
                        </div>
                }
                </div> : null
        }
        </>
    )
})
