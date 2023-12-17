import React, { useEffect, useState, forwardRef, useCallback } from "react";

export const Tile = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { uuid, target, ...other } = props;

    return (
        <div key={ uuid } className={`w-dull h-full box-border rounded-sm bg-zinc-900 ${ target ? "border-2 cursor-pointer" : "" }`} { ...other } />
    )
})
