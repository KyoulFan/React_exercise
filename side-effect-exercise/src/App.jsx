import React, { useEffect, useState } from "react";

function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [cards, setCards] = useState([]);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Part 1: 页面加载时创建一副新牌
  useEffect(() => {
    async function getNewDeck() {
      try {
        setIsLoadingDeck(true);
        const res = await fetch(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        const data = await res.json();

        setDeckId(data.deck_id);
        setRemaining(data.remaining); // 一般是52
      } catch (err) {
        console.error("Error getting new deck:", err);
        alert("Error: cannot load deck.");
      } finally {
        setIsLoadingDeck(false);
      }
    }

    getNewDeck();
  }, []);

  // 点击抽牌
  async function handleDraw() {
    // 没有牌堆 / 正在操作中就不处理
    if (!deckId || isDrawing || isShuffling) return;

    // 没牌了就提示
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

      // 把新牌加到已抽牌数组
      setCards((prevCards) => [...prevCards, drawnCard]);

      // 更新剩余数量
      setRemaining(data.remaining);
    } catch (err) {
      console.error("Error drawing card:", err);
      alert("Error: cannot draw card.");
    } finally {
      setIsDrawing(false);
    }
  }

  // Part 2: 洗牌重置
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

      // 清空画面上的牌
      setCards([]);
      // 重置剩余牌数量（一般是52，直接读返回值更保险）
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

      {/* 状态提示 */}
      {isLoadingDeck && <p>Loading deck...</p>}
      {!isLoadingDeck && !deckId && <p>Failed to load deck.</p>}

      {/* 操作按钮 */}
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

      {/* 展示已抽出的牌：简单一点全部列出来 */}
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
