import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { Card } from "./Card";
import { Unit } from "./Unit";
import { Tile } from "./Tile";

export const Game = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { ws, game, network, chat, connected, error } = props;

    // websocket messages
    const nextTargets = (team, targets) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "NextTargets", "Team": team, "MoreDetails": {"Targets": targets}}));
    }
    const playCard = (team, card, targets) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "PlayCard", "Team": team, "MoreDetails": {"Card": card, "Targets": targets}}));
    }
    const sackCard = (team, card, option) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "SackCard", "Team": team, "MoreDetails": {"Card": card, "Option": option}}));
    }
    const attackUnit = (team, attacker, defender) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "AttackUnit", "Team": team, "MoreDetails": {"Attacker": attacker, "Defender": defender}}));
    }
    const moveUnit = (team, unit, tile) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "MoveUnit", "Team": team, "MoreDetails": {"Unit": unit, "Tile": tile}}));
    }
    const endTurn = (team) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "EndTurn", "Team": team}));
    }

    // network data
    const team = connected && network ? connected[network.Name] : ""

    // game data
    const opponent = game && team ? game.Teams[0] == team ? game.Teams[1] : game.Teams[0] : ""
    const board = game?.MoreData.Board
    const hand = game?.MoreData.Hand
    const deck = game?.MoreData.Deck
    const mana = game?.MoreData.Mana
    const range = game?.MoreData.PlayRange
    const sacked = game && team && game.Turn == team ? game.MoreData.Sacked[team] : true
    const targets = game?.Targets

    // targeting
    const [current, setCurrent] = useState([]);
    const [sack, setSack] = useState(null);
    useEffect(() => nextTargets(team, []), [team])
    useEffect(() => nextTargets(team, current), [current])
    useEffect(() => {
        if (current.length > 0 && targets.length == 0) {
            setSack()
            setCurrent([])
            if (hand[team].reduce((acc, val) => acc + (val.UUID == current[0] ? 1 : 0), 0) == 1) {
                playCard(team, current[0], current.slice(1))
            } else if (board.reduce((acc, col) => acc + col.reduce((acc, tile) => acc + (tile.Unit && tile.Unit.UUID == current[0] ? 1 : 0), 0), 0) == 1 && current.length == 2) {
                if (board.reduce((acc, col) => acc + col.reduce((acc, tile) => acc + (tile.Unit && tile.Unit.UUID == current[1] ? 1 : 0), 0), 0) == 1) {
                    attackUnit(team, current[0], current[1])
                } else if (board.reduce((acc, col) => acc + col.reduce((acc, tile) => acc + (tile.UUID == current[1] ? 1 : 0), 0), 0) == 1) {
                    moveUnit(team, current[0], current[1])
                }
            }
        }
    }, [current, targets])

    // board must stay at a 7x6 width to height ratio
    const scale = 0.66;
    const [tileSize, setTileSize] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const handleResize = useCallback(() => {
        const width = 3;
        const height = 7;
        if (!ref || !ref.current) return;
        if (ref.current.clientHeight/height < ref.current.clientWidth/width) {
            setWidth(ref.current.clientHeight/height*width*scale);
            setHeight(ref.current.clientHeight*scale);
            setTileSize(ref.current.clientHeight/height*scale);
        } else {
            setWidth(ref.current.clientWidth*scale);
            setHeight(ref.current.clientWidth/width*height*scale);
            setTileSize(ref.current.clientWidth/width*scale);
        }
    }, [ref])
    useEffect(() => handleResize());
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    }, [handleResize]);

    return (<>{
        team ? 
            <div className="w-full h-full flex flex-col justify-start items-center grow">
                <div className="w-full h-full flex flex-row justify-between z-10">
                    <div className="grow w-[20%] flex items-center justify-center">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="w-full flex flex-col items-end">
                                <p>Mana { mana[opponent].Amount }/{ mana[opponent].BaseAmount }</p>
                                <p>Deck { deck[opponent] }/{ 30 }</p>
                                <p>Hand { hand[opponent].length }/{ 10 }</p>
                            </div>
                            <div>
                                Display card on hover here
                            </div>
                            <div className="w-full flex flex-col items-end">   
                                <p>Mana { mana[team].Amount }/{ mana[team].BaseAmount }</p>
                                <p>Deck { deck[opponent] }/{ 30 }</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row overflow-hidden bg-zinc-800" style={{width: `${width}px`, height: `${height}px`}}>
                    {
                        board?.map((col, cIdx) =>
                            <div key={cIdx} className="w-full flex flex-col justify-center" style={{height: `${height}px`}}>
                                {
                                    col.map((val, i) => range[team][0] != 0 ? val : col[col.length - 1 - i]).map((tile, rIdx) =>
                                        <div key={`${rIdx},${cIdx}`} className="flex items-center justify-center" style={{width: `${tileSize}px`, height: `${tileSize}px`}}>
                                            <div className={`w-[90%] h-[90%] rounded-sm`}>
                                            {
                                                tile.Unit ? 
                                                    <Unit data={ tile.Unit } target={ targets.includes(tile.Unit.UUID) } team={ game.MoreData.UUIDToTeam[tile.Unit.Player] } onClick={() => {
                                                        if (targets.includes(tile.Unit.UUID)) setCurrent(old => [...old, tile.Unit.UUID])
                                                    }} /> : 
                                                    <Tile uuid={ tile.UUID } target={ targets.includes(tile.UUID) } onClick={() => {
                                                        if (targets.includes(tile.UUID)) setCurrent(old => [...old, tile.UUID])
                                                    }} />
                                            }
                                            </div>
                                        </div>)
                                }
                            </div>
                        )
                    } 
                    </div>
                    <div className="grow w-[20%] flex flex-col justify-between">
                        <div>
                            Action log here
                        </div>
                        <div className="flex flex-col gap-1">
                            <button className={`p-2 rounded-sm box-border ${game.Turn == team && current.length > 0 ? "bg-zinc-400" : "bg-zinc-500"}`} onClick={() => {
                                if (game.Turn == team && current.length > 0) {
                                    setSack()
                                    setCurrent([])
                                }
                            }}>Clear Targets</button>
                            <button className={`p-2 rounded-sm box-border ${game.Turn == team ? current.length == 0 && targets.length == 0 ? "bg-amber-500" : "bg-zinc-400" : "bg-zinc-500"}`} onClick={() => {
                                if (game.Turn == team) {
                                    setSack()
                                    endTurn(team)
                                }
                            }}>End Turn</button>
                        </div>
                    </div>
                </div>
                <hr className="my-4"/>
                <div className="flex justify-center w-full space-x-4">
                    {
                        hand[team].map((data, idx) => 
                            <div key={ idx } style={{width: `${ tileSize*.9 }px`, height: `${ tileSize*.9 }px`}} onClick={() => {
                                if (current.length == 0 && targets.includes(data.UUID)) setCurrent(old => [...old, data.UUID])
                                if (!sack && !sacked) setSack(data.UUID)
                            }}>
                                {
                                    sack == data.UUID && !sacked ? 
                                        <div className="absolute">
                                            <div className="absolute top-[-24px] flex justify-between" style={{width: `${ tileSize*.9 }px`}}>
                                                <button className="bg-blue-400 px-2 rounded-full font-bold w-8 h-4" onClick={() => {
                                                    setSack()
                                                    setCurrent([])
                                                    sackCard(team, data.UUID, "Mana")
                                                }}/>
                                                <button className="bg-amber-400 px-2 rounded-full font-bold w-8 h-4" onClick={() => {
                                                    setSack()
                                                    setCurrent([])
                                                    sackCard(team, data.UUID, "Cards")
                                                }} />
                                            </div>
                                        </div> : null
                                }
                                <Card data={ data } team={ team } target={ !sack && (targets.includes(data.UUID) || !sacked) } /> 
                            </div>
                        )
                    }
                </div>
            </div>
        : null
        }</>)
})
