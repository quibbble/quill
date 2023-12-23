import React, { useState, useLayoutEffect, useRef, createRef } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { GamePage, HomePage, DownPage, RulesPage, BugsPage } from "@quibbble/boardgame";
import { Game } from "./game/Game";
import Rules from "./rules.md";
import { DeckOptions } from "./builder/DeckOptions";
import { DeckBuilderPage } from "./builder/DeckBuilderPage";

const config = {
  // server attributes
  host: import.meta.env.VITE_HOST,
  websocket: import.meta.env.VITE_WEBSOCKET,

  // game attributes
  key: "Quill",
  variants: {},
  minTeams: 2,
  maxTeams: 2,

  // styling attributes
  font: "coquette",
  color: "gray-500",

  // misc attributes
  gamePageMaxWidth: "max-w-xl"
}

export default function App() {
    const ref = createRef();
    const ws = useRef();

    const [game, setGame] = useState();
    const [network, setNetwork] = useState();
    const [chat, setChat] = useState([]);
    const [connected, setConnected] = useState();
    const [error, setError] = useState();

    const [rules, setRules] = useState("");

    const [options, setOptions] = useState({
      Seed: Date.now(),
      Decks: [[
        "S0001", "S0001", "S0002", "S0002", "S0003", "S0003", "S0004", "S0004", "S0006", "S0009",
        "I0002", "I0002", "I0007", "I0008", "U0002", "U0002", "U0003", "U0003", "U0004", "U0004",
        "U0005", "U0005", "U0006", "U0006", "U0007", "U0007", "U0008", "U0008", "U0010", "U0010"
      ], [
        "S0001", "S0001", "S0002", "S0002", "S0003", "S0003", "S0004", "S0004", "S0006", "S0009",
        "I0002", "I0002", "I0007", "I0008", "U0002", "U0002", "U0003", "U0003", "U0004", "U0004",
        "U0005", "U0005", "U0006", "U0006", "U0007", "U0007", "U0008", "U0008", "U0010", "U0010"
      ]]
    })

    useLayoutEffect(() => {
      fetch(Rules)
        .then(response => response.text())
        .then(text => setRules(text))
    }, [])
  
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/:gameID" element=
            { 
              <GamePage config={ config }
                ref={ ref } ws={ ws }
                game={ game } setGame={ setGame }
                network={ network } setNetwork={ setNetwork }
                chat={ chat } setChat={ setChat }
                connected={ connected } setConnected={ setConnected }
                error={ error } setError={ setError }>
                  <Game ref={ ref } ws={ ws }
                    game={ game } network={ network } 
                    chat={ chat } connected={ connected } error={ error } />
              </GamePage>
            }
          />
          <Route exact path="/build" element={ <DeckBuilderPage config={ config } ref={ ref } /> }/>
          <Route exact path="/status/down" element={ <DownPage config={ config } /> }/>
          <Route exact path="/rules" element={ <RulesPage config={ config } rules={ rules } /> }/>
          <Route exact path="/bugs" element={ <BugsPage config={ config } /> }/>
          <Route path="/" element=
          { 
            <HomePage config={ config } options={ options } setOptions={ setOptions }>
              <DeckOptions setOptions={ setOptions }/>
            </HomePage>
          } 
          />
        </Routes>
      </BrowserRouter>
    );
}
