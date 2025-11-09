import React, { useEffect, useState } from "react";

function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [cards, setCards] = useState([]);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Part 1: loading cards
  useEffect(() => {
    async function getNewDeck() {
      try {
        setIsLoadingDeck(true);
        const res = await fetch(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        const data = await res.json();

        setDeckId(data.deck_id);
        setRemaining(data.remaining);
      } catch (err) {
        console.error("Error getting new deck:", err);
        alert("Error: cannot load deck.");
      } finally {
        setIsLoadingDeck(false);
      }
    }

    getNewDeck();
  }, []);

  // click to shuffle
  async function handleDraw() {
    if (!deckId || isDrawing || isShuffling) return;

    if (remaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }

    try {
      setIsDrawing(true);
      const res = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const data = await res.json();

      if (!data.success) {
        alert("Error: cannot draw card.");
        return;
      }

      const drawnCard = data.cards[0];

      setCards((prevCards) => [...prevCards, drawnCard]);

      setRemaining(data.remaining);
    } catch (err) {
      console.error("Error drawing card:", err);
      alert("Error: cannot draw card.");
    } finally {
      setIsDrawing(false);
    }
  }

  async function handleShuffle() {
    if (!deckId || isShuffling || isDrawing) return;

    try {
      setIsShuffling(true);

      const res = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
      );
      const data = await res.json();

      if (!data.success) {
        alert("Error: cannot shuffle deck.");
        setIsShuffling(false);
        return;
      }

      setCards([]);
      setRemaining(data.remaining || 52);
    } catch (err) {
      console.error("Error shuffling deck:", err);
      alert("Error: cannot shuffle deck.");
    } finally {
      setIsShuffling(false);
    }
  }

  return (
    <div>
      <h1>Deck of Cards</h1>

      {isLoadingDeck && <p>Loading deck...</p>}
      {!isLoadingDeck && !deckId && <p>Failed to load deck.</p>}

      <div>
        <button
          onClick={handleDraw}
          disabled={isLoadingDeck || !deckId || isDrawing || isShuffling}
        >
          {isDrawing ? "Drawing..." : "Draw Card"}
        </button>

        <button
          onClick={handleShuffle}
          disabled={isLoadingDeck || !deckId || isShuffling}
        >
          {isShuffling ? "Shuffling..." : "Shuffle Deck"}
        </button>
      </div>

      <p>Cards remaining: {remaining}</p>

      <div>
        {cards.map((card) => (
          <div key={card.code}>
            <img src={card.image} alt={card.code} />
            <p>
              {card.value} of {card.suit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
