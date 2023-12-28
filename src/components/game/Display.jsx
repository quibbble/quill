import React, { useEffect, useState, forwardRef, useCallback, cloneElement } from "react";
import reactStringReplace from 'react-string-replace';
import { LuSword, LuHourglass, LuHeart, LuDroplet } from "react-icons/lu";
import { GiCrossbow, GiAura, GiNightSleep, GiPresent, GiAssassinPocket, GiRun, GiPoison, GiWalkingBoot, GiSpikedArmor, GiHoodedFigure, GiMoebiusStar, GiCatapult, GiStarSkull, GiCloudRing, GiHeavenGate, GiPencilRuler, GiDodge, GiPencil, GiLightningTrio, GiSkullCrack, GiBugleCall, GiEnrage, GiTowerFlag, GiWalk, GiHearts, GiHourglass, GiPointySword, GiDrop, GiWaterDrop, GiCobra, GiBroadsword, GiBootPrints } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { MdShield } from "react-icons/md";
import { FaHandshakeSimple, FaHandshakeSimpleSlash } from "react-icons/fa6";
import { PiBoot } from "react-icons/pi";
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
    replaced = reactStringReplace(replaced, "'Attack'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Health'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Cooldown'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'BaseMovemebt'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Movement'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'BaseMovement'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Mana'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'BaseMana'", (match, i) => BuildStat(match.substring(1, match.length-1), i))
    replaced = reactStringReplace(replaced, "'Codex'", (match, i) => BuildStat(match.substring(1, match.length-1), i))

    return replaced
};

export const BuildStat = (type, i) => {
    const m = {
        "Attack": <GiBroadsword className="text-red-500 align-middle inline-flex" />,
        "Cooldown": <GiHourglass className="text-amber-500 align-middle inline-flex" />,
        "BaseCooldown": <GiHourglass className="text-zinc-100 align-middle inline-flex" />,
        "Movement": <GiWalkingBoot className="text-yellow-500 align-middle inline-flex" />,
        "BaseMovement": <GiWalkingBoot className="text-zinc-100 align-middle inline-flex" />,
        "Health": <GiHearts className="text-green-500 align-middle inline-flex" />,
        "Mana":  <GiWaterDrop className="text-blue-500 align-middle inline-flex" />,
        "BaseMana":  <GiWaterDrop className="text-zinc-100 align-middle inline-flex" />,
        "Codex":  <GiPencil className="text-purple-500 align-middle inline-flex" />,
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
        "Poison": <GiCobra className="text-purple-500 align-middle inline-flex" />,
        "Physical": <LuSword className="text-red-500 align-middle inline-flex" />,
        "Ranged": <GiCrossbow className="text-orange-500 align-middle inline-flex" />,
        "Pure": <GiCloudRing className="text-slate-200 align-middle inline-flex" />,
    }
    return m[type] ? React.cloneElement(m[type], { key: `${ type + i }` }) : null
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
    const { data, width, height, scale, ...other } = props;

    const buildTrait = (trait, i, enableTooltip) => {
        // THe following traits are not currently added
        // Eternal
        const m = {
            "Aimless": {
                color: "yellow-500", icon: (_) => <GiBootPrints className="align-middle inline-flex" />,
                text: (_) => <>codex is ranomized each turn.</>
            },
            "Assassin": {
                color: "red-500", icon: (args) => <div><GiAssassinPocket className="align-middle inline-flex" /> { args.Amount }</div>, 
                text: (args) => <>attacking a unit from behind deals { args.Amount } extra damage.</>
            },
            "BattleCry": {
                color: "yellow-500", icon: (args) => <div><GiBugleCall className="align-middle inline-flex mr-1" /><span className="text-zinc-100" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>{ buildDescription(args.Description) }</span></div>, 
                text: (args) => <>on place or summon { buildDescription(args.Description) }</>
            },
            "Berserk": {
                color: "orange-500", icon: (_) => <GiAura className="align-middle inline-flex" />, 
                text: (_) => <>killing a unit resets <LuHourglass className="text-amber-500 align-middle inline-flex" /> to 0</>
            },
            "Buff": {
                color: "green-500", icon: (args) => <div>{ BuildStat(args.Stat) } { args.Amount }</div>, 
                text: (args) => <>increase { BuildStat(args.Stat) } by { args.Amount }</>
            },
            "DeathCry": {
                color: "orange-500", icon: (args) => <div><GiSkullCrack className="align-middle inline-flex mr-1" /><span className="text-zinc-100" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>{ buildDescription(args.Description) }</span></div>, 
                text: (args) => <>on death { buildDescription(args.Description) }</>
            },
            "Debuff": {
                color: "red-500", icon: (args) => <div>{ BuildStat(args.Stat) } { args.Amount }</div>, 
                text: (args) => <>decrease { BuildStat(args.Stat) } by { args.Amount }</>
            },
            "Dodge": {
                color: "lime-500", icon: (_) => <GiDodge className="align-middle inline-flex" />, 
                text: (_) => <>incoming attacks have a 1 in 3 chance of missing</>
            },
            "Enemies": {
                color: "orange-500", icon: (args) => <div><div className="flex items-center justify-center gap-1"><FaHandshakeSimpleSlash className="align-middle inline-flex"/>{ buildTrait(args.Trait, i, false) }</div></div>, 
                text: (args) => <div className="flex gap-1">{ args.ChooseUnits.Type.toLowerCase() } enemies gain { buildTrait(args.Trait) }</div>
            },
            "Enrage": {
                color: "red-500", icon: (args) => <div><GiEnrage className="align-middle inline-flex mr-1" /><span className="text-zinc-100" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>{ buildDescription(args.Description) }</span></div>, 
                text: (args) => <>on taking damage { buildDescription(args.Description) }</>
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
                color: "indigo-500", icon: (args) => <div><div className="flex items-center justify-center"><GiPresent className="align-middle inline-flex"/>{ buildTrait(args.Trait, i, false) }</div></div>, 
                text: (args) => <div className="flex gap-1">on attack give unit { buildTrait(args.Trait) }</div>
            },
            "Haste": {
                color: "yellow-500", icon: (_) => <GiRun className="align-middle inline-flex" />,
                text: (_) => <>on place or summon { BuildStat("Cooldown", 0) } is set to zero</>
            },
            "Lobber": {
                color: "yellow-500", icon: (_) => <GiCatapult className="align-middle inline-flex" />,
                text: (_) => <>ranged unit deals damage to target and all adjacent units</>
            },
            "Pillage": {
                color: "yellow-500", icon: (args) => <div><GiTowerFlag className="align-middle inline-flex mr-1" /><span className="text-zinc-100" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>{ buildDescription(args.Description) }</span></div>, 
                text: (args) => <>on damaging a base { buildDescription(args.Description) }</>
            },
            "Poison": {
                color: "purple-500", icon: (args) => <div><GiCobra className="align-middle inline-flex" /> { args.Amount }</div>,
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
                text: (_) => <>codex is valid in all directions</>
            },
            "Shield": {
                color: "amber-500", icon: (args) => <div><MdShield className="align-middle inline-flex" /> { args.Amount }</div>,
                text: (args) => <>mitigate { args.Amount } { buildDamageType("Physical", 0) } damage</>
            },
            "Spiky": {
                color: "red-500", icon: (args) => <div><GiSpikedArmor className="align-middle inline-flex" /> { args.Amount }</div>,
                text: (args) => <>when attacked deal { args.Amount } extra { buildDamageType("Physical", 0) } damage</>
            },
            "Surge": {
                color: "yellow-500", icon: (_) => <GiLightningTrio className="align-middle inline-flex" />,
                text: (_) => <>gain { BuildStat("Attack", 0) } equal to current mana pool</>
            },
            "Thief": {
                color: "indigo-500", icon: (_) => <GiHoodedFigure className="align-middle inline-flex" />,
                text: (_) => <>if possible steal an item instead of attacking</>
            },
            "Tired": {
                color: "blue-500", icon: (_) => <GiNightSleep className="align-middle inline-flex" />,
                text: (_) => <>does not { BuildStat("Cooldown", 0) } on turn end</>
            },
            "Ward": {
                color: "blue-500", icon: (args) => <div><GiMoebiusStar className="align-middle inline-flex" /> { args.Amount }</div>,
                text: (args) => <>mitigate { args.Amount } { buildDamageType("Magic", 0) } damage</>
            }
        }
        const rand = Math.floor(Math.random() * 10000)
        return (<>{
                    m[trait.Type] ? 
                    <>
                        <div data-tooltip-id={ trait.Type + i + rand } className="cursor-pointer flex items-center justify-cente">
                            { React.cloneElement(m[trait.Type].icon(trait.Args), { className:  `text-${ m[trait.Type].color }` }) }
                        </div>
                        {
                            enableTooltip ? 
                                <Tooltip id={ trait.Type + i + rand } place="bottom" className="z-50 flex gap-1 items-center justify-center" style={{ fontSize: `${1 * scale}rem`, lineHeight: `${1.5*scale}rem` }}>
                                    <span className={ `font-bold text-${ m[trait.Type].color }` }>{ trait.Type }</span> { m[trait.Type].text(trait.Args) }
                                </Tooltip> : null
                        }
                    </> : null
                }</>)
    }

    return (
        <>
        {
            data && data.Init ? 
                <div className="select-none">
                    <div className={`bg-zinc-900 rounded-sm p-2 flex flex-col h-full justify-between`} style={{ width: width, height: height }} {...other}>
                        <div>
                            <div className={`flex justify-between font-bold`} style={{ fontSize: `${1 * scale}rem`, lineHeight: `${1.5*scale}rem` }}>
                                <p>{data.Init.Name}</p>
                                <p className={`flex items-center justify-center ${ data.Cost > data.Init.Cost ? "text-green-500" : data.Cost < data.Init.Cost ? "text-red-500" : "" }`}>{ BuildStat("Mana") } { data.Cost }</p>
                            </div>
                            <div className="flex justify-between" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>
                                {
                                    data.Init.ID[0] == "S" ? 
                                        <p className={`font-bold text-indigo-500`}>Spell</p> : 
                                        data.Init.ID[0] == "I" ? 
                                            <p className={`font-bold text-orange-500`}>Item</p> :
                                            <>{ buildUnitType(data.Type) }</>
                                }
                                
                            </div>
                            <div className="flex flex-col mt-4 break-words" style={{ fontSize: `${1 * scale}rem`, lineHeight: `${1.5*scale}rem` }}>
                                <p className="inline-block break-words" style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>{ buildDescription(data.Init.Description) }</p>
                                <div className={`flex-wrap flex items-center justify-center gap-1 ${ data.Init.Description && data.Init.ID[0] != "I" && data.Traits.length > 0 ? "mt-4" : "mt-0" }`}>
                                    {
                                        data.Traits.map((trait, i) => 
                                            <div key={ i } className={`${ trait.CreatedBy == data.UUID ? "bg-transparent" : "bg-slate-800" } rounded-sm px-1`}>
                                                { buildTrait(trait, i, true) }
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={`flex-wrap flex items-center justify-center gap-1 ${ data.Init.Description && data.HeldTraits && data.HeldTraits.length > 0 ? "mt-4" : "mt-0" }`}>
                                    {
                                        data.HeldTraits && data.HeldTraits.length > 0 ? 
                                            <>
                                            {
                                                data.HeldTraits.map((trait, i) => 
                                                    <div key={ i } className={`${ trait.CreatedBy == data.UUID ? "bg-transparent" : "bg-slate-800" } rounded-sm px-1`}>
                                                        { buildTrait(trait, i, true) }
                                                    </div>
                                                )
                                            }
                                            </> : null
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
                                    <div className="flex justify-between font-bold w-full px-[.5rem] pb-[1rem] md:pb-[1.25rem]" style={{ fontSize: `${1 * scale}rem`, lineHeight: `${1.5*scale}rem` }}>
                                        <p className={`flex items-center justify-center ${ data.Attack > data.Init.Attack ? "text-green-500" : data.Attack < data.Init.Attack ? "text-red-500" : "" }`}>{ BuildStat("Attack") } { data.Attack }</p>
                                        <p className={`flex items-center justify-center ${ data.Cooldown > data.Init.Cooldown ? "text-red-500" : data.Cooldown < data.Init.Cooldown ? "text-green-500" : "" }`}>{ BuildStat("Cooldown") } { data.Cooldown > 0 ? data.Cooldown : 0 }</p>
                                        <p className={`flex items-center justify-center ${ data.Movement > data.Init.Movement ? "text-red-500" : data.Movement < data.Init.Movement ? "text-green-500" : "" }`}>{ BuildStat("Movement") } { data.Movement > 0 ? data.Movement : 0 }</p>
                                        <p className={`flex items-center justify-center ${ data.Health > data.Init.Health ? "text-green-500" : data.Health < data.Init.Health ? "text-red-500" : "" }`}>{ BuildStat("Health") } { data.Health }</p>
                                    </div>
                                </div> : null
                        }
                    </div> 
                    <div style={{ fontSize: `${.875 * scale}rem`, lineHeight: `${1.25*scale}rem` }}>
                        {
                            data.Items?.map((item, i) => {
                                return <div key={ i } className="text-2xs md:text-xs rounded-sm bg-zinc-900 p-2 mt-1">
                                    <div data-tooltip-id={ item.Init.Name + i } className="font-bold text-amber-500">{ item.Init.Name }</div>
                                    <Tooltip id={ item.Init.Name + i } place="top-start" className="z-50" style={{ backgroundColor: "transparent" }}>
                                        <Display data={ item } width={ width } height={ height } scale={ scale } />
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
