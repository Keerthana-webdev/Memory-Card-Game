import { useState, useEffect } from "react";
import "./App.css";

const difficulties = {
  easy: { pairs: 4, time: 60 },
  medium: { pairs: 8, time: 90 },
  hard: { pairs: 12, time: 120 },
  expert: { pairs: 18, time: 150 }
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState(null);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);

  // CREATE IMAGE CARDS
  const generateCards = (pairs, theme) => {
    let arr = [];

    for (let i = 0; i < pairs; i++) {
      const image =
        `https://picsum.photos/300?random=${theme}${i}`;

      arr.push(image);
      arr.push(image);
    }

    return arr.sort(() => Math.random() - 0.5);
  };

  // START GAME
  useEffect(() => {
  if (difficulty) {

    setCards(
      generateCards(
        difficulty.pairs,
        theme
      )
    );

    setTime(difficulty.time);

    setMoves(0);

    setMatched([]);
    setFlipped([]);
  }
}, [difficulty, theme]);

  // TIMER
  useEffect(() => {
    if (screen === "game" && time > 0) {
      const timer = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [screen, time]);

  // FLIP CARD
  const flipCard = (index) => {
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !matched.includes(index)
    ) {
      setFlipped([...flipped, index]);
    }
  };

  // MATCH CHECK
  useEffect(() => {
    if (flipped.length === 2) {

      setMoves((m) => m + 1);

      const [a, b] = flipped;

      if (cards[a] === cards[b]) {

        setMatched((prev) => [...prev, a, b]);

        setFlipped([]);

      } else {

        setTimeout(() => {

          setFlipped([]);

        }, 800);
      }
    }
  }, [flipped, cards]);

  // WIN
  useEffect(() => {
    if (
      matched.length === cards.length &&
      cards.length > 0
    ) {
      setTimeout(() => {
        setScreen("win");
      }, 500);
    }
  }, [matched, cards]);

  // HOME SCREEN
  if (screen === "home") {
    return (
      <div className="page">

        <div className="home-card">

          <div className="icon">
            🧠
          </div>

          <h1>
            Memory Card Game
          </h1>

          <p>
            Challenge your memory with
            beautiful themed cards
          </p>

          <button
            className="main-btn"

            onClick={() =>
              setScreen("theme")
            }
          >
            Start Game
          </button>

        </div>

      </div>
    );
  }

  // THEME SCREEN
  if (screen === "theme") {
    return (
      <div className="page">

        <div className="theme-box">

          <div className="purple-icon">
            ✨
          </div>

          <h2>
            AI Game Master
          </h2>

          <p>
            Enter a theme for your
            memory game
          </p>

          <input
            placeholder="space adventure"

            value={theme}

            onChange={(e) =>
              setTheme(e.target.value)
            }
          />

          <button
            className="main-btn"

            onClick={() =>
              setScreen("difficulty")
            }
          >
            Generate Game
          </button>

        </div>

      </div>
    );
  }

  // DIFFICULTY SCREEN
  if (screen === "difficulty") {
    return (
      <div className="page">

        <div className="difficulty-box">

          <h2>
            Select Difficulty
          </h2>

          {
            Object.entries(difficulties)
            .map(([key, val]) => (

              <div
                key={key}

                className="difficulty-card"

                onClick={() => {

                  setDifficulty(val);

                  setScreen("game");
                }}
              >

                <div>

                  <h3>
                    {key.toUpperCase()}
                  </h3>

                  <p>
                    {val.pairs} pairs
                  </p>

                </div>

                <span>
                  {val.time}s
                </span>

              </div>
            ))
          }

        </div>

      </div>
    );
  }

  // WIN SCREEN
  if (screen === "win") {
    return (
      <div className="page">

        <div className="home-card">

          <h1>
            🎉 You Won!
          </h1>

          <p>
            Completed in {moves} moves
          </p>

          <button
            className="main-btn"

            onClick={() =>
              window.location.reload()
            }
          >
            Play Again
          </button>

        </div>

      </div>
    );
  }

  // GAME SCREEN
  return (
    <div className="game-page">

      <div className="topbar">

        <div className="stat-box">
          ⏱ {time}s
        </div>

        <div className="stat-box">
          🎯 {moves} moves
        </div>

      </div>

      <div className="grid">

        {
          cards.map((card, index) => {

            const isFlipped =
              flipped.includes(index) ||
              matched.includes(index);

            return (

              <div
                key={index}

                className={`card ${
                  isFlipped ? "flip" : ""
                }`}

                onClick={() =>
                  flipCard(index)
                }
              >

                <div className="card-inner">

                  <div className="card-front">
                    ?
                  </div>

                  <div
                    className="card-back"

                    style={{
                      backgroundImage:
                        `url(${card})`
                    }}
                  />

                </div>

              </div>
            );
          })
        }

      </div>

    </div>
  );
}