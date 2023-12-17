import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { Unit } from "./Unit";

export const Card = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, ...other } = props;

    return (
        <div key={ data.UUID } className={`w-full h-full flex box-border items-center justify-center rounded-sm text-zinc-800 ${ target ? `bg-${ team }-400 cursor-pointer` : `bg-${ team }-500` }`} { ...other }>
            { 
                data?.Init.ID[0] == "U" ? 
                    <Unit {...props} /> :
                    <div className="font-bold">{ data?.Init.ID.toLowerCase() }</div> 
            }
        </div>
    )
})
