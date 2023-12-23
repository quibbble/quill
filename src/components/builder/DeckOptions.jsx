import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function DeckOptions({ setOptions }) {

    const navigate = useNavigate();

    const [decks, setDecks] = useState([{
        Name: "Default",
        Deck: [
            "S0001", "S0001", "S0002", "S0002", "S0003", "S0003", "S0004", "S0004", "S0006", "S0009",
            "I0002", "I0002", "I0007", "I0008", "U0002", "U0002", "U0003", "U0003", "U0004", "U0004",
            "U0005", "U0005", "U0006", "U0006", "U0007", "U0007", "U0008", "U0008", "U0010", "U0010"
        ]
    }])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('decks'))
        if (stored) setDecks(decks => [...decks, ...stored.filter(deck => deck.Deck.length == 30)])
    }, []);

    return (
        <>
        <div className="flex">
            <div className="mx-1 ml-2 font-black text-red-500">Red</div>
            <select className="px-2 bg-zinc-800 text-xs h-6 border font-bold border-zinc-100 focus:outline-none" id="players" onChange={ e => setOptions(options => ({ ...options, ...{ Decks: [JSON.parse(e.target.value), options.Decks[1]] } })) }>
                { decks.map((el, i) => <option key={ el.Name + i } value={ JSON.stringify(el.Deck) }>{ el.Name }</option>) }
            </select>
        </div>
        <div className="flex">
            <div className="mx-1 ml-2 font-black text-blue-500">Blue</div>
            <select className="px-2 bg-zinc-800 text-xs h-6 border font-bold border-zinc-100 focus:outline-none" id="players" onChange={ e => setOptions(options => ({ ...options, ...{ Decks: [options.Decks[0], JSON.parse(e.target.value)] } })) }>
                { decks.map((el, i) => <option key={ el.Name + i } value={ JSON.stringify(el.Deck) }>{ el.Name }</option>) }
            </select>
        </div>
        <div className="ml-2 font-black text-zinc-100 bg-zinc-600 px-2 py-1 cursor-pointer" onClick={() => navigate("/build")}>Deck Builder</div>
        </>
    )
}