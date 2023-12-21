import React, { useEffect, useState, forwardRef, useCallback, cloneElement } from "react";
import reactStringReplace from 'react-string-replace';
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";
import { GiCrossbow, GiAura, GiNightSleep, GiPresent, GiAssassinPocket, GiRun, GiPoison, GiWalkingBoot, GiSpikedArmor, GiHoodedFigure, GiMoebiusStar, GiCatapult, GiStarSkull, GiCloudRing, GiHeavenGate, GiPencilRuler, GiDodge } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { MdShield } from "react-icons/md";
import { FaHandshakeSimple, FaHandshakeSimpleSlash } from "react-icons/fa6";
import { Tooltip } from 'react-tooltip'

const buildDescription = (text) => {

    // damage types
    let replaced = reactStringReplace(text, "'Magic'", (match, i) => buildDamageType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Physical'", (match, i) => buildDamageType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Ranged'", (match, i) => buildDamageType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Pure'", (match, i) => buildDamageType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Poison'", (match, i) => buildDamageType(match.substring(1, match.length-1), i))

    // unit types
    replaced = reactStringReplace(replaced, "'Creature'", (match, i) =>  buildUnitType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Structure'", (match, i) => buildUnitType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Base'", (match, i) => buildUnitType(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Unit'", (match, i) => buildUnitType(match.substring(1, match.length-1), i))

    // unit stats
    replaced = reactStringReplace(replaced, "'Attack'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Health'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Cooldown'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'BaseMovemebt'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Movement'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'BaseMovement'", (match, i) => buildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Mana'", (match, i) => buildStat(match.substring(1, match.length-1), i))

    return replaced
};

const buildStat = (type, i) => {
    const m = {
        "Attack": <LuSword className="text-red-500 align-middle inline-flex" />,
        "Cooldown": <LuHourglass className="text-amber-500 align-middle inline-flex" />,
        "BaseCooldown": <LuHourglass className="text-amber-500 align-middle inline-flex" />,
        "Movement": <GiWalkingBoot className="text-yellow-500 align-middle inline-flex" />,
        "BaseMovement": <GiWalkingBoot className="text-yellow-500 align-middle inline-flex" />,
        "Health": <LuHeart className="text-green-500 align-middle inline-flex" />,
        "Mana":  <LuDroplet className="text-blue-500 align-middle inline-flex" />,
    }
    return m[type] ? React.cloneElement(m[type], { key: `${ type + i }` }) : null
}

const buildUnitType = (type, i) => {
    const m = {
        "Unit": <span className="text-slate-200 font-bold">{ type }</span>,
        "Creature": <span className="text-green-500 font-bold">{ type }</span>,
        "Structure": <span className="text-yellow-500 font-bold">{ type }</span>,
        "Base": <span className="text-red-500 font-bold">{ type }</span>,
    }
    return m[type] ? React.cloneElement(m[type], { key: `${ type + i }` }) : null
}

const buildDamageType = (type, i) => {
    const m = {
        "Magic": <BsStars className="text-blue-500 align-middle inline-flex" />,
        "Poison": <GiPoison className="text-purple-500 align-middle inline-flex" />,
        "Physical": <LuSword className="text-red-500 align-middle inline-flex" />,
        "Ranged": <GiCrossbow className="text-orange-500 align-middle inline-flex" />,
        "Pure": <GiCloudRing className="text-slate-200 align-middle inline-flex" />,
    }
    return m[type] ? React.cloneElement(m[type], { key: `${ type + i }` }) : null
}

const buildTrait = (trait, i, enableTooltip) => {
    // THe following traits are not currently added
    // BattleCry, DeathCry, Enrage, Eternal, Pillage
    const m = {
        "Assassin": {
            color: "red-500", icon: (args) => <div><GiAssassinPocket /> { args.Amount }</div>, 
            text: (args) => <>Attacking a unit from behind deals { args.Amount } extra damage.</>
        },
        "Berserk": {
            color: "orange-500", icon: (_) => <GiAura />, 
            text: (_) => <>killing a unit resets <LuHourglass className="text-amber-500 align-middle inline-flex" /> to 0</>
        },
        "Buff": {
            color: "green-500", icon: (args) => <div>{ buildStat(args.Stat) } { args.Amount }</div>, 
            text: (args) => <>increase { buildStat(args.Stat) } by { args.Amount }</>
        },
        "Debuff": {
            color: "red-500", icon: (args) => <div>{ buildStat(args.Stat) } { args.Amount }</div>, 
            text: (args) => <>decrease { buildStat(args.Stat) } by { args.Amount }</>
        },
        "Dodge": {
            color: "red-500", icon: (_) => <GiDodge className="align-middle inline-flex" />, 
            text: (_) => <>incoming attacks have a 1 in 3 chance of missing</>
        },
        "Enemies": {
            color: "orange-500", icon: (args) => <div><div className="flex items-center justify-center gap-1"><FaHandshakeSimpleSlash className="align-middle inline-flex"/>{ buildTrait(args.Trait, i, false) }</div></div>, 
            text: (args) => <div className="flex gap-1">{ args.ChooseUnits.Type.toLowerCase() } enemies gain { buildTrait(args.Trait) }</div>
        },
        "Execute": {
            color: "red-500", icon: (_) => <GiStarSkull className="align-middle inline-flex" />, 
            text: (_) => <>on attack if a unit is injured kill it</>
        },
        "Friends": {
            color: "blue-500", icon: (args) => <div><div className="flex items-center justify-center gap-1"><FaHandshakeSimple className="align-middle inline-flex"/>{ buildTrait(args.Trait, i, false) }</div></div>, 
            text: (args) => <div className="flex gap-1">{ args.ChooseUnits.Type.toLowerCase() } allies gain { buildTrait(args.Trait) }</div>
        },
        "Gift": {
            color: "indigo-500", icon: (args) => <div><div className="flex items-center justify-center gap-1"><GiPresent className="align-middle inline-flex"/>{ buildTrait(args.Trait, i, false) }</div></div>, 
            text: (args) => <div className="flex gap-1">on attack give unit { buildTrait(args.Trait) }</div>
        },
        "Haste": {
            color: "yellow-500", icon: (_) => <GiRun className="align-middle inline-flex" />,
            text: (_) => <>on place or summon { buildStat("Cooldown", 0) } is set to zero</>
        },
        "Lobber": {
            color: "yellow-500", icon: (_) => <GiCatapult className="align-middle inline-flex" />,
            text: (_) => <>ranged unit deals damage to target and all adjacent units</>
        },
        "Poison": {
            color: "purple-500", icon: (args) => <div><GiPoison className="align-middle inline-flex" /> { args.Amount }</div>,
            text: (args) => <>on turn end take { args.Amount } { buildDamageType("Magic", 0) } damage</>
        },
        "Purity": {
            color: "slate-200", icon: (_) => <GiHeavenGate className="align-middle inline-flex" />,
            text: (_) => <>cannot be targeted by spells</>
        },
        "Ranged": {
            color: "orange-500", icon: (args) => <div>{ buildDamageType("Ranged") } { args.Amount }</div>,
            text: (args) => <>attack up to { args.Amount } spaces away and do not take return damage</>
        },
        "Recode": {
            color: "indigo-500", icon: (_) => <GiPencilRuler className="align-middle inline-flex" />,
            text: (_) => <>can move in all directions</>
        },
        "Shield": {
            color: "amber-500", icon: (args) => <div><MdShield className="align-middle inline-flex" /> { args.Amount }</div>,
            text: (args) => <>mitigate { args.Amount } { buildDamageType("Physical", 0) } damage</>
        },
        "Spiky": {
            color: "red-500", icon: (args) => <div><GiSpikedArmor className="align-middle inline-flex" /> { args.Amount }</div>,
            text: (args) => <>when attacked deal { args.Amount } extra { buildDamageType("Physical", 0) } damage</>
        },
        "Thief": {
            color: "indigo-500", icon: (_) => <GiHoodedFigure className="align-middle inline-flex" />,
            text: (_) => <>steal an item instead of attacking</>
        },
        "Tired": {
            color: "blue-500", icon: (_) => <GiNightSleep className="align-middle inline-flex" />,
            text: (_) => <>does not { buildStat("Cooldown", 0) } on turn end</>
        },
        "Ward": {
            color: "blue-500", icon: (args) => <div><GiMoebiusStar className="align-middle inline-flex" /> { args.Amount }</div>,
            text: (args) => <>mitigate { args.Amount } { buildDamageType("Magic", 0) } damage</>
        }
    }
    return (<>{
                m[trait.Type] ? 
                <>
                    <div data-tooltip-id={ trait.Type + i } className="cursor-pointer flex items-center justify-cente">
                        { React.cloneElement(m[trait.Type].icon(trait.Args), { className:  `text-${ m[trait.Type].color }` }) }
                    </div>
                    {
                        enableTooltip ? 
                            <Tooltip id={ trait.Type + i } place="bottom" className="z-50 flex gap-1 items-center justify-center">
                                <span className={ `font-bold text-${ m[trait.Type].color }` }>{ trait.Type }</span> { m[trait.Type].text(trait.Args) }
                            </Tooltip> : null
                    }
                </> : null
            }</>)
}

export const CodexTop = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 top-0"
export const CodexBot = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-b-0 bottom-0"
export const CodexLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-l-0 left-0"
export const CodexRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-r-0 right-0"
export const CodexTopLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-45 top-0 left-[-3px]"
export const CodexTopRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-45 top-0 right-[-3px]"
export const CodexBotLeft = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 -rotate-[135deg] bottom-0 left-[-3px]"
export const CodexBotRight = "absolute block w-0 h-0 border-[5px] border-solid border-transparent border-t-0 rotate-[135deg] bottom-0 right-[-3px]"

export const BuildCodexColor = (code) => code == "1" ? "zinc-100" : "zinc-500"

export const Display = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { data, width, height, ...other } = props;

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
                                            <>{ buildUnitType(data.Type) }</>
                                }
                                
                            </div>
                            <div className="flex flex-col text-2xs md:text-sm mt-4 break-words">
                                <div className="flex flex-wrap">
                                    {
                                        data.HeldTraits && data.HeldTraits.length > 0 ?
                                            <span className="flex flex-wrap gap-1">
                                                Gain
                                                {
                                                    data.HeldTraits.map((trait, i) => 
                                                        <span key={ i } className={`${ trait.CreatedBy == data.UUID ? "bg-transparent" : "bg-slate-800 rounded-sm" } px-1`}>
                                                            { buildTrait(trait, i, true) }
                                                        </span>
                                                    ) 
                                                }.
                                            </span> : null
                                    }
                                    <p className="inline-block break-words">{ buildDescription(data.Init.Description) }</p>
                                </div>
                                <div className={`flex-wrap flex items-center justify-center text-xs md:text-base gap-1 ${ data.Init.Description ? "mt-4" : "mt-0" }`}>
                                    {
                                        data.Traits.map((trait, i) => 
                                            <div key={ i } className={`${ trait.CreatedBy == data.UUID ? "bg-transparent" : "bg-slate-800" } rounded-sm px-1`}>
                                                { buildTrait(trait, i, true) }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            data.Init.ID[0] == "U" ? 
                                <div className="flex flex-col items-center w-full relative">
                                    <div className="flex items-center justify-center absolute bottom-[-.5rem] mb-4 w-full" style={{height: width*.33}}>
                                        <div className={`${ CodexTop } border-b-${ BuildCodexColor(data?.Codex[0]) }`}/>                
                                        <div className={`${ CodexBot } border-t-${ BuildCodexColor(data?.Codex[1]) }`}/>                
                                        <div className={`${ CodexLeft } border-r-${ BuildCodexColor(data?.Codex[2]) }`}/>                
                                        <div className={`${ CodexRight } border-l-${ BuildCodexColor(data?.Codex[3]) }`}/>                
                                        <div className={`${ CodexTopLeft } border-b-${ BuildCodexColor(data?.Codex[4]) }`}/>
                                        <div className={`${ CodexBotRight } border-b-${ BuildCodexColor(data?.Codex[5]) }`}/>
                                        <div className={`${ CodexBotLeft } border-b-${ BuildCodexColor(data?.Codex[6]) }`}/>                
                                        <div className={`${ CodexTopRight } border-b-${ BuildCodexColor(data?.Codex[7]) }`}/>
                                    </div>
                                    <div className="flex justify-between font-bold w-full px-[.5rem] md:px-[.75rem] pb-[1rem] md:pb-[1.4rem] text-xs md:text-base">
                                        <p className={`flex items-center justify-center ${ data.Attack > data.Init.Attack ? "text-green-500" : data.Attack < data.Init.Attack ? "text-red-500" : "" }`}>{ buildStat("Attack") } { data.Attack }</p>
                                        <p className={`flex items-center justify-center ${ data.Cooldown > data.Init.Cooldown ? "text-red-500" : data.Cooldown < data.Init.Cooldown ? "text-green-500" : "" }`}>{ buildStat("Cooldown") } { data.Cooldown > 0 ? data.Cooldown : 0 }</p>
                                        <p className={`flex items-center justify-center ${ data.Health > data.Init.Health ? "text-green-500" : data.Health < data.Init.Health ? "text-red-500" : "" }`}>{ buildStat("Health") } { data.Health }</p>
                                    </div>
                                </div> : null
                        }
                    </div> 
                    <div className="text-xs md:text-base">
                        {
                            data.Items?.map((item, i) => {
                                return <div key={ i } className="text-2xs md:text-xs rounded-sm bg-zinc-900 p-2 mt-1">
                                    <div data-tooltip-id={ item.Init.Name + i } className="font-bold text-amber-500">{ item.Init.Name }</div>
                                    <Tooltip id={ item.Init.Name + i } place="bottom" className="z-50">
                                        <div className={`flex flex-wrap gap-1 text-xs md:text-sm`}>
                                            Gain
                                            {
                                                item.HeldTraits.map((trait, i) => 
                                                    <div key={ i } className={`${ trait.CreatedBy == item.UUID ? "bg-transparent" : "bg-slate-80 px-1" } rounded-sm`}>
                                                        { buildTrait(trait, i, true) }
                                                    </div>
                                                ) 
                                            }.
                                        </div>
                                        <p className="inline-block">{ buildDescription(item.Init.Description) }</p>
                                    </Tooltip>
                                </div>
                            })
                        }
                    </div>
                </div>
                : null
        }
        </>
    )
})
