import React, { useEffect, useState, useRef, forwardRef, useCallback } from "react";

export const Log = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { logs, ...other } = props;

    const logsEndRef = useRef(null)

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => { scrollToBottom() }, [logs]);

    const build = (log) => {
        if (log.ActionType == "SackCard") {
            return <div>Sacked for { log.MoreDetails.Option }</div>
        } else if (log.ActionType == "PlayCard") {
            return <div>Played {log.MoreDetails.PlayCard.Init.Name}</div>
        } else if (log.ActionType == "MoveUnit") {
            return <div>Moved {log.MoreDetails.UnitCard.Init.Name} to {log.MoreDetails.TileXY[0]}, {log.MoreDetails.TileXY[1]}</div>
        } else if (log.ActionType == "AttackUnit") {
            return <div>{log.MoreDetails.AttackerCard.Init.Name} attacked {log.MoreDetails.DefenderCard.Init.Name}</div>
        } else if (log.ActionType == "EndTurn") {
            return <div>End Turn</div>
        }
    }

    return (
        <div className="h-full flex flex-col bg-zinc-900 rounded-sm">
            <div className="font-bold mb-1 px-2 pt-2">Logs</div>
            <div className="bg-zinc-900 p-2 w-full h-full rounded-sm" { ...other }>
                <div className="flex flex-col gap-1 h-full overflow-scroll no-scrollbar">
                { 
                    logs ? logs.map((log, i) => 
                        <div className={`bg-zinc-800 text-${ log.Team }-500 p-1 text-xs rounded-sm`} key={ i }>{ build(log) }</div>
                    ) : null
                }
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>

    )
})
