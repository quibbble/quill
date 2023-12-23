import React, { useEffect, useState, forwardRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Tooltip } from 'react-tooltip'
import { BuildStat, Display } from "../game/Display";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";

axios.defaults.withCredentials = true

export const DeckBuilderPage = forwardRef(({ config }, ref) => {
    
    const navigate = useNavigate();

    const perPage = 9

    const [cards, setCards] = useState([])
    const [cardsMap, setCardsMap] = useState({})
    const [active, setActive] = useState([])
    const [page, setPage] = useState(0)
    const [pages, setPages] = useState(0)
    const [decks, setDecks] = useState([])
    const [selected, setSelected] = useState(-1)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('decks'))
        if (stored) setDecks(stored)
    }, [])

    useEffect(() => {
        localStorage.setItem("decks", JSON.stringify(decks))
    }, [decks])

    const [types, setTypes] = useState(['I', 'S', 'U'])
    const [cost, setCost] = useState(null)

    useEffect(() => {
        let filter = cards
            .filter((card) => types.includes(card.Init.ID[0]))
            .filter((card) => !cost || card.Cost == cost)
        setPages(Math.ceil(filter.length / perPage))
        setActive(filter)
    }, [cards, types, cost])

    useEffect(() => {
        const info = async (host, gameKey) => {
            let config = {
                method: 'GET',
                url: `${ host }/game/info?GameKey=${ gameKey }`,
            };
            let resp = await axios(config).catch(error => error.response)
            if (resp.data.MoreInfo) {
                let m = {}
                let c = []
                for (let card of resp.data.MoreInfo.Cards) {
                    if (card.Init.ID == "U0001") continue
                    c.push(card)
                    m[card.Init.ID] = card
                }
                setCardsMap(m)
                setCards(c)
            }
        }
        info(config.host, config.key)
    }, [])

    const [tileSize, setTileSize] = useState(0);
    const handleResize = useCallback(() => {
        const scale = .85;
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

    return (
        <div className="min-h-screen flex flex-col items-center p-2 md:p-4 fade-in">
            <div ref={ref} className={`h-full w-full ${ config.gamePageMaxWidth ? config.gamePageMaxWidth : "max-w-xl" } flex flex-col items-center justify-between grow`}>
                <div className="w-full flex items-center justify-between">
                    <div className="cursor-pointer" onClick={() => setPage(page => page > 0 ? page-1 : 0)}><ImArrowLeft className="text-2xl" /></div>
                    <div>Page { pages > 0 ? page + 1 : 0 }/{ pages }</div>
                    <div className={`flex gap-1 font-bold`}>
                        <div className={`cursor-pointer rounded-sm px-2 py-1 ${ types.includes('I') ? "bg-amber-500" : "bg-zinc-500" }`} onClick={() => {
                            setTypes(types => {
                                let filter = types.filter(type => type != 'I')
                                if (filter.length == types.length) filter.push('I')
                                return filter
                            })
                            setPage(0)
                        }}>Item</div>
                        <div className={`cursor-pointer rounded-sm px-2 py-1 ${ types.includes('S') ? "bg-amber-500" : "bg-zinc-500" }`} onClick={() => {
                            setTypes(types => {
                                let filter = types.filter(type => type != 'S')
                                if (filter.length == types.length) filter.push('S')
                                return filter
                            })
                            setPage(0)
                        }}>Spell</div>
                        <div className={`cursor-pointer rounded-sm px-2 py-1 ${ types.includes('U') ? "bg-amber-500" : "bg-zinc-500" }`} onClick={() => {
                            setTypes(types => {
                                let filter = types.filter(type => type != 'U')
                                if (filter.length == types.length) filter.push('U')
                                return filter
                            })
                            setPage(0)
                        }}>Unit</div>
                    </div>
                    <div className="cursor-pointer" onClick={() => setPage(page => page < pages-1 ? page+1 : pages-1)}><ImArrowRight className="text-2xl" /></div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {
                        active.slice(page*perPage, page*perPage+perPage).map((card, i) => <span className="cursor-pointer"><Display key={ i } data={ card } width={ tileSize*2 } height={ tileSize*3 } scale={ .85 } onClick={() => {
                            if (selected >= 0 && decks[selected].Deck.length < 30 && decks[selected].Deck.reduce((acc, curr) => curr == card.Init.ID ? acc+1 : acc, 0) < 2) {
                                setDecks(decks => decks.map((deck, i) => {
                                    if (selected != i) return deck
                                    else return {...deck, ...{Deck: [...deck.Deck, card.Init.ID]}}
                                }))
                            }
                        }} /></span>)
                    }
                </div>
                <div className="w-full flex items-start justify-between h-32">
                    {
                        selected >= 0 ? 
                                    <>
                                    <div className="flex flex-wrap gap-1 text-sm overflow-scroll no-scrollbar max-h-full">
                                        {
                                            decks[selected].Deck.filter((it, i, ar) => ar.indexOf(it) == i)
                                                                .map((id) => ({id: id, count: decks[selected].Deck.reduce((acc, curr) => curr == id ? acc + 1 : acc, 0)}))
                                                                .sort((a, b) => cardsMap[a.id].Cost > cardsMap[b.id].Cost)
                                                                .map((el, i) => {
                                                return <span key={ i }>
                                                    <div data-tooltip-id={ el.id + i } className={`bg-zinc-900 p-2 cursor-pointer rounded-sm`} onClick={() => {
                                                        setDecks(decks => decks.map((deck, j) => {
                                                            if (selected != j) return deck
                                                            else {
                                                                let index = decks[selected].Deck.indexOf(el.id)
                                                                return {...deck, ...{Deck: decks[selected].Deck.filter((_, k) => k != index)}}
                                                            }
                                                        }))
                                                    }}>{ cardsMap[el.id].Cost }{ BuildStat("Mana") } <span className={`${ el.id[0] == 'I' ? "text-orange-500" : el.id[0] == 'S' ? "text-blue-500" : "text-green-500" }`}>{ cardsMap[el.id].Init.Name }</span> x{el.count}</div>
                                                    <Tooltip id={ el.id + i } place="top" className="z-50" style={{ backgroundColor: "transparent" }}>
                                                        <Display data={ cardsMap[el.id] } width={ tileSize*2 } height={ tileSize*3 } scale={ .85 } />
                                                    </Tooltip>
                                                </span>
                                            })
                                        }
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex rounded-sm overflow-hidden">
                                            <input className="w-24 bg-zinc-900 border-none outline-none px-2 py-1" type="text" value={ decks[selected].Name } onChange={e => {
                                                setDecks(decks => decks.map((deck, i) => {
                                                    if (selected != i) return deck
                                                    else return {...deck, ...{Name: e.target.value}}
                                                }))
                                            }}/>
                                            <div className="px-2 py-1 bg-red-500 cursor-pointer" onClick={() => {
                                                setDecks(decks => decks.filter((_, i) => i != selected))
                                                setSelected(-1)
                                            }}>X</div>
                                        </div>
                                        <div className="self-center">{ decks[selected].Deck.length }/30 cards</div>
                                        <div className="px-2 py-1 bg-amber-500 cursor-pointer" onClick={() => setSelected(-1)}>Done</div>
                                    </div>
                                    </> :
                                    <>
                                    <div className="flex flex-row flex-wrap gap-1 text-sm">
                                        { 
                                            decks && decks.length < 5 ? 
                                                <div className="cursor-pointer flex items-center justify-center p-2 bg-amber-500 rounded-sm font-bold" onClick={() => {
                                                    setDecks(decks => [...decks, {Name: "New Deck", Deck: []}])
                                                }}>+ New Deck</div> : null 
                                        }
                                        {
                                            decks.map((deck, i) => <div key={ i } className="cursor-pointer flex items-center justify-center p-2 bg-zinc-900 rounded-sm font-bold" onClick={() => setSelected(i)}>{ deck.Name }</div>)
                                        }                                                                                                                                                                                                                                                                                    
                                    </div>
                                    <div className="flex flex-col w-24">
                                        <div className="px-2 py-1 bg-amber-500 cursor-pointer" onClick={() => navigate("/")}>Back</div>
                                    </div>
                                    </>
                    }
                </div>
            </div>
        </div>
    )
})
