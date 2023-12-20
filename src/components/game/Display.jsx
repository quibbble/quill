import React, { useEffect, useState, forwardRef, useCallback } from "react";
import reactStringReplace from 'react-string-replace';
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";
import { GiCrossbow } from "react-icons/gi";
import { BsStars } from "react-icons/bs";

const replace = (text) => {
    // damage types
    let replaced = reactStringReplace(text, "'Magic'", (match, i) => (
        <BsStars key={ match+i } className="text-blue-500 align-middle inline-flex" />
    ));
    replaced = reactStringReplace(replaced, "'Physical'", (match, i) => (
        <span key={ match+i } className="text-orange-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Ranged'", (match, i) => (
        <span key={ match+i } className="text-yellow-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Pure'", (match, i) => (
        <span key={ match+i } className="text-slate-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Poison'", (match, i) => (
        <span key={ match+i } className="text-purple-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));

    // unit types
    replaced = reactStringReplace(replaced, "'Creature'", (match, i) => (
        <span key={ match+i } className="text-green-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Structure'", (match, i) => (
        <span key={ match+i } className="text-yellow-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Base'", (match, i) => (
        <span key={ match+i } className="text-red-500 font-bold">{ match.substring(1, match.length-1) }</span>
    ));
    replaced = reactStringReplace(replaced, "'Unit'", (match, i) => (
        <span key={ match+i } className="text-slate-400 font-bold">{ match.substring(1, match.length-1) }</span>
    ));

    // unit attributes
    replaced = reactStringReplace(replaced, "'Attack'", (match, i) => (
        <LuSword key={ match+i } className="text-red-500 align-middle inline-flex" />
    ));
    replaced = reactStringReplace(replaced, "'Cooldown'", (match, i) => (
        <LuHourglass key={ match+i } className="text-amber-500 align-middle inline-flex" />
    ));
    replaced = reactStringReplace(replaced, "'Health'", (match, i) => (
        <LuHeart key={ match+i } className="text-green-500 align-middle inline-flex" />
    ));
    replaced = reactStringReplace(replaced, "'Mana'", (match, i) => (
        <LuDroplet key={ match+i } className="text-blue-500 align-middle inline-flex" />
    ));

    // traits
    replaced = reactStringReplace(replaced, "'Range'", (match, i) => (
        <GiCrossbow key={ match+i } className="text-red-500 align-middle inline-flex" />
    ));
    return replaced
};

const unitColors = (type) => {
    if (type == "Creature") return "text-green-500"
    else if (type == "Structure") return "text-yellow-500"
    else if (type == "Base") return "text-red-500"
}

const damageType = (type) => {
    if (type == "Physical") return <LuSword className="text-red-500" />
    else if (type == "Magic") return <BsStars className="text-blue-500" />
    else if (type == "Ranged") return <GiCrossbow className="text-red-500" />
}

const top = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 top-0"
const bot = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-b-0 bottom-0"
const left = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-l-0 left-0"
const right = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-r-0 right-0"
const topLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-45 top-0 left-[-3px]"
const topRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-45 top-0 right-[-3px]"
const botLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-[135deg] bottom-0 left-[-3px]"
const botRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-[135deg] bottom-0 right-[-3px]"

export const Display = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, width, height, ...other } = props;

    const color = (code) => code == "1" ? "zinc-100" : "zinc-500"

    return (
        <>
        {
            data && data.Init ? 
                <div>
                    <div className={`bg-zinc-900 rounded-sm px-2 py-1 flex flex-col h-full justify-between`} style={{ width: width, height: height }} {...other}>
                        <div>
                            <div className="flex justify-between font-bold text-xs md:text-base">
                                <p>{data.Init.Name}</p>
                                <p className={`flex items-center justify-center ${ data.Cost > data.Init.Cost ? "text-green-500" : data.Cost < data.Init.Cost ? "text-red-500" : "" }`}><LuDroplet className="text-blue-500" /> { data.Cost }</p>
                            </div>
                            <div className="flex justify-between text-2xs md:text-xs">
                                {
                                    data.Init.ID[0] == "S" ? 
                                        <p className={`font-bold text-indigo-500`}>Spell</p> : 
                                        data.Init.ID[0] == "I" ? 
                                            <p className={`font-bold text-orange-500`}>Item</p> :
                                            <p className={`font-bold ${ unitColors(data.Type) }`}>{data.Type}</p>
                                }
                                
                            </div>
                            <div className="flex justify-between text-2xs md:text-sm mt-4 break-words">
                                <p className="inline-block">{ data ? replace(data.Init.Description) : "" }</p>
                            </div>
                        </div>
                        {
                            data.Init.ID[0] == "U" ? 
                                <div className="flex flex-col items-center w-full relative">
                                    <div className="flex items-center justify-center absolute bottom-[-.5rem] mb-4 w-full" style={{height: width*.33}}>
                                        <div className={`${ top } border-b-${ color(data?.Codex[0]) }`}/>                
                                        <div className={`${ bot } border-t-${ color(data?.Codex[1]) }`}/>                
                                        <div className={`${ left } border-r-${ color(data?.Codex[2]) }`}/>                
                                        <div className={`${ right } border-l-${ color(data?.Codex[3]) }`}/>                
                                        <div className={`${ topLeft } border-b-${ color(data?.Codex[4]) }`}/>
                                        <div className={`${ botRight } border-b-${ color(data?.Codex[5]) }`}/>
                                        <div className={`${ botLeft } border-b-${ color(data?.Codex[6]) }`}/>                
                                        <div className={`${ topRight } border-b-${ color(data?.Codex[7]) }`}/>
                                    </div>
                                    <div className="flex justify-between font-bold w-full px-[.5rem] md:px-[.75rem] pb-[1rem] md:pb-[1.4rem] text-xs md:text-base">
                                        <p className={`flex items-center justify-center ${ data.Attack > data.Init.Attack ? "text-green-500" : data.Attack < data.Init.Attack ? "text-red-500" : "" }`}>{ damageType(data.DamageType) } { data.Attack }</p>
                                        <p className={`flex items-center justify-center ${ data.Cooldown > data.Init.Cooldown ? "text-red-500" : data.Cooldown < data.Init.Cooldown ? "text-green-500" : "" }`}><LuHourglass className="text-amber-500" /> { data.Cooldown > 0 ? data.Cooldown : 0 }</p>
                                        <p className={`flex items-center justify-center ${ data.Health > data.Init.Health ? "text-green-500" : data.Health < data.Init.Health ? "text-red-500" : "" }`}><LuHeart className="text-green-500" /> { data.Health }</p>
                                    </div>
                                </div> : null
                        }
                    </div> 
                    <div className="text-xs md:text-base">
                        {
                            data.Items?.map((item, i) => {
                                return <div key={ i }>{ item.Init.Name }</div>
                            })
                        }
                    </div>
                    <div className="text-xs md:text-base">
                        {
                            data.Traits.map((trait, i) => {
                                return <div key={ i }>{ trait.Type }</div>
                            })
                        }
                    </div>
                </div>
                : null
        }
        </>
    )
})
