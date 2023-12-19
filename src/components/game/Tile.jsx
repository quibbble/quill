import React, { useEffect, useState, forwardRef, useCallback } from "react";

export const Tile = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { uuid, target, ...other } = props;

    return (
        <div key={ uuid } className={`w-dull h-full box-border rounded-sm ${ target ? "bg-zinc-500 cursor-pointer" : "bg-zinc-700" }`} { ...other } />
    )
})
