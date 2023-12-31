import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { Card } from "./Card";
import { Unit } from "./Unit";
import { Tile } from "./Tile";
import { Display } from "./Display";
import { LuDroplet } from "react-icons/lu";
import { GiCardPick, GiCardRandom } from "react-icons/gi";
import { Log } from "./Log";

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
    const logs = game ? game.Actions : []
    const [targets, setTargets] = useState([]);
    useEffect(() => {
        setTargets(game ? game.Targets : [])
    }, [game])

    // targeting
    const [current, setCurrent] = useState([]);
    const [sack, setSack] = useState(null);
    useEffect(() => nextTargets(team, []), [team])
    useEffect(() => {
        if (current.length == 2 && current[0] == current[1]) return
        nextTargets(team, current)
    }, [current])
    useEffect(() => {
        if (current.length == 1 && targets.length == 0) {
            setTargets(current)
        } else if (current.length == 2 && current[0] == current[1]) {
            setSack()
            setCurrent([])
            if (hand[team].reduce((acc, val) => acc + (val.UUID == current[0] ? 1 : 0), 0) == 1) {
                playCard(team, current[0], [])
            }
        } else if (current.length > 0 && targets.length == 0) {
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

    // display
    const [display, setDisplay] = useState();

    // board must stay at a 3x7 width to height ratio
    const [tileSize, setTileSize] = useState(0);
    const handleResize = useCallback(() => {
        const scale = 0.97;
        const w = 7;
        const h = 7;
        if (!ref || !ref.current) return;
        if (ref.current.clientHeight/h < ref.current.clientWidth/w) {
            setTileSize(ref.current.clientHeight/h*scale);
        } else {
            setTileSize(ref.current.clientWidth/w*scale);
        }
    }, [ref])
    useEffect(() => handleResize());
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    }, [handleResize]);

    return (<>{
        team ? 
            <div className="w-full h-full flex flex-col justify-center items-center grow">
                <div className="w-full h-full flex flex-row justify-between">
                    <div className="grow w-[20%] flex items-center justify-center">
                        <div className="w-full h-full flex flex-col justify-between items-end">
                            <div className="w-full flex flex-col items-end text-xs md:text-base">
                                <p className="inline-block font-bold"><LuDroplet className="text-blue-500 align-middle inline-flex" /> { mana[opponent].Amount }/{ mana[opponent].BaseAmount }</p>
                                <p className="inline-block font-bold"><GiCardPick className="text-orange-500 align-middle inline-flex" /> { deck[opponent] }/{ 30 }</p>
                                <p className="inline-block font-bold"><GiCardRandom className="text-yellow-500 align-middle inline-flex" /> { hand[opponent].length }/{ 10 }</p>
                            </div>
                            <div>
                                <Display data={ display } width={ tileSize*2 } height={ tileSize*3 } scale={ ref && ref.current && ref.current.clientWidth < 400 ? .65 : .9 } />
                            </div>
                            <div className="w-full flex flex-col items-end text-xs md:text-base">   
                                <p className="inline-block font-bold"><LuDroplet className="text-blue-500 align-middle inline-flex" /> { mana[team].Amount }/{ mana[team].BaseAmount }</p>
                                <p className="inline-block font-bold"><GiCardPick className="text-orange-500 align-middle inline-flex" /> { deck[team] }/{ 30 }</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row overflow-hidden bg-zinc-800" style={{width: `${tileSize*3}px`, height: `${tileSize*7}px`}}>
                    {
                        board?.map((col, cIdx) =>
                            <div key={cIdx} className="w-full flex flex-col justify-center" style={{height: `${tileSize*7}px`}}>
                                {
                                    col.map((val, i) => range[team][0] != 0 ? val : col[col.length - 1 - i]).map((tile, rIdx) =>
                                        <div key={`${rIdx},${cIdx}`} className="flex items-center justify-center" style={{width: `${tileSize}px`, height: `${tileSize}px`}}>
                                            <div className={`w-[90%] h-[90%] rounded-sm`}>
                                            {
                                                tile.Unit ? 
                                                    <Unit data={ tile.Unit } target={ targets.includes(tile.Unit.UUID) } team={ game.MoreData.UUIDToTeam[tile.Unit.Player] } onClick={() => {
                                                        if (targets.includes(tile.Unit.UUID)) setCurrent(old => [...old, tile.Unit.UUID])
                                                    }} onMouseEnter={() => {
                                                        setDisplay(tile.Unit)
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
                        <div className="h-36 md:h-64 w-full">
                            <Log logs={ logs } />
                        </div>
                        <div className="flex flex-col gap-1 text-xs md:text-base">
                            <button className={`p-2 rounded-sm box-border ${game.Turn == team && (current.length > 0 || sack) ? "bg-amber-500" : "bg-zinc-900"}`} onClick={() => {
                                if (game.Turn == team && (current.length > 0 || sack)) {
                                    setSack()
                                    setCurrent([])
                                }
                            }}>Clear Targets</button>
                            <button className={`p-2 rounded-sm box-border ${game.Turn == team ? current.length == 0 && targets.length == 0 ? "bg-amber-500" : "bg-amber-500" : "bg-zinc-900"}`} onClick={() => {
                                if (game.Turn == team) {
                                    setSack()
                                    setCurrent([])
                                    endTurn(team)
                                }
                            }}>End Turn</button>
                        </div>
                    </div>
                </div>
                <hr className="my-4"/>
                <div className="flex justify-center gap-2">
                    {
                        hand[team].map((data, idx) => 
                            <div key={ idx } style={{width: `${ tileSize*.9 }px`, height: `${ tileSize*.9 }px`}} onClick={() => {
                                if (targets.includes(data.UUID)) setCurrent(old => [...old, data.UUID])
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
                                <Card data={ data } team={ team } target={ (!sack || sack == data.UUID) && (targets.includes(data.UUID) || !sacked) } onMouseEnter={() => {
                                    setDisplay(data)
                                }} /> 
                            </div>
                        )
                    }
                </div>
            </div>
        : <div>Select a team to play</div>
        }</>)
})
