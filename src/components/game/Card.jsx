import React, { useEffect, useState, forwardRef, useCallback } from "react";

export const Card = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, team, target, ...other } = props;

    return (
        <div key={ data.UUID } className={`w-full h-full flex box-border items-center justify-center rounded-sm text-zinc-800 bg-${ team }-500 ${ target ? "border-2 cursor-pointer" : "" }`} { ...other }>
            { data?.Init?.Name }
        </div>
    )
})
