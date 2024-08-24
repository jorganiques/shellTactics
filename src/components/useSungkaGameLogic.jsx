// useSungkaGameLogic.jsx
import { useEffect, useRef, useState } from 'react';
import { useGameState, useGameDispatch } from './SungkaGameContext';

export const useSungkaGameLogic = (mode) => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const { board, currentTurn, animating, captureMessage, winMessage, gameEnded } = state;
  const animatingRef = useRef(animating);
  const [feedbackMessage, setFeedbackMessage] = useState(''); 
  const [highlightedPits, setHighlightedPits] = useState([]);

  useEffect(() => {
    if (animatingRef.current !== animating) {
      animatingRef.current = animating;
    }
  }, [animating]);

  useEffect(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [mode, dispatch]);

  useEffect(() => {
    if (mode === 'one-player' && currentTurn === 'Player B' && !animating && !gameEnded) {
      setTimeout(() => handleComputerTurn(), 1000);
    }

    if (currentTurn === 'Player A') {
      setHighlightedPits(Array.from({ length: 7 }, (_, i) => i));
    } else if (currentTurn === 'Player B') {
      setHighlightedPits(Array.from({ length: 7 }, (_, i) => i + 8));
    }

    if (!gameEnded && isOutOfMoves(currentTurn)) {
      checkEndGame();
    }
  }, [currentTurn, animating, gameEnded, board, mode]);

  const handlePitClick = (index) => {
    if (animating || board[index] === 0 || !isValidPit(index) || gameEnded) return;

    const highlightPits = currentTurn === 'Player A'
      ? Array.from({ length: 7 }, (_, i) => i)
      : Array.from({ length: 7 }, (_, i) => i + 8);

    setHighlightedPits(highlightPits);

    let pitNumber = currentTurn === 'Player B' ? index - 8 + 1 : index + 1;
    setFeedbackMessage(`${currentTurn} is about to make a move from Bahay ${pitNumber}`);

    setTimeout(() => {
      setFeedbackMessage('');
      dispatch({ type: 'SET_ANIMATING_AND_CAPTURE', payload: { animating: true, captureMessage: '' } });

      let stones = board[index];
      let newBoard = [...board];
      newBoard[index] = 0;

      const distributeStones = () => {
        if (stones > 0) {
          index = (index + 1) % 16;
          if (shouldSkipUlo(index)) return distributeStones();

          newBoard[index] += 1;
          stones -= 1;
          dispatch({ type: 'SET_BOARD', payload: newBoard });
          setTimeout(distributeStones, 500);
        } else {
          dispatch({ type: 'SET_ANIMATING_AND_CAPTURE', payload: { animating: false, captureMessage: '' } });
          checkCapture(index);
          if (!checkExtraTurn(index)) {
            if (isOutOfMoves(currentTurn)) {
              checkEndGame();
            } else {
              switchTurn();
            }
          }
        }
      };

      distributeStones();
    }, 1000);
  };

  const handleComputerTurn = () => {
    const validPits = board.slice(8, 15).map((stones, i) => stones > 0 && i + 8).filter(Boolean);
    const randomPit = validPits[Math.floor(Math.random() * validPits.length)];
    handlePitClick(randomPit);
  };

  const isValidPit = (index) => (currentTurn === 'Player A' && index < 7) || (currentTurn === 'Player B' && index > 7);

  const shouldSkipUlo = (index) =>
    (currentTurn === 'Player A' && index === 15) || (currentTurn === 'Player B' && index === 7);

  const checkCapture = (lastIndex) => {
    const isPlayerA = currentTurn === 'Player A';
    const isOwnPit = isPlayerA ? lastIndex < 7 : lastIndex >= 8 && lastIndex < 15;
    const oppositeIndex = 14 - lastIndex;

    if (isOwnPit && board[lastIndex] === 1 && board[oppositeIndex] > 0) {
        let newBoard = [...board];
        const uloIndex = isPlayerA ? 7 : 15;

        newBoard[uloIndex] += newBoard[oppositeIndex] + 1;
        newBoard[lastIndex] = 0;
        newBoard[oppositeIndex] = 0;

        const pitNumber = oppositeIndex < 7 ? oppositeIndex + 1 : oppositeIndex - 7;
        const opponent = isPlayerA ? 'AI' : 'Player A';
        
        // Set capture message
        dispatch({
            type: 'SET_CAPTURE_MESSAGE',
            payload: `${currentTurn} captured bahay number ${pitNumber} of the ${opponent}.`,
        });

        dispatch({ type: 'SET_BOARD', payload: newBoard });

        if (mode === 'one-player' && currentTurn === 'Player A') {
            setTimeout(() => {
                dispatch({ type: 'SET_CAPTURE_MESSAGE', payload: '' });
                switchTurn();
            }, 5000);
        } else {
            switchTurn();
        }
    }
};

  const checkExtraTurn = (lastIndex) => (currentTurn === 'Player A' && lastIndex === 7) || (currentTurn === 'Player B' && lastIndex === 15);

  const switchTurn = () => {
    dispatch({ type: 'SWITCH_TURN' });
  };

  const checkEndGame = () => {
    const [playerAPits, playerBPits] = [board.slice(0, 7), board.slice(8, 15)]
      .map(pits => pits.reduce((acc, stones) => acc + stones, 0));

    if (playerAPits === 0 || playerBPits === 0) {
      let newBoard = [...board];
      newBoard[7] += playerAPits;
      newBoard[15] += playerBPits;
      for (let i = 0; i < 7; i++) newBoard[i] = 0;
      for (let i = 8; i < 15; i++) newBoard[i] = 0;

      dispatch({ type: 'SET_BOARD', payload: newBoard });

      const winner = newBoard[7] > newBoard[15] ? 'Player A' : 'Player B';
      
      dispatch({
        type: 'END_GAME',
        payload: {
        winner,
        board: newBoard,
      },
      });
    }
  };

  const isOutOfMoves = (player) => board.slice(player === 'Player A' ? 0 : 8, player === 'Player A' ? 7 : 15).every(pit => pit === 0);

  return {
    board,
    currentTurn,
    animating,
    captureMessage,
    winMessage,
    gameEnded,
    feedbackMessage,
    highlightedPits,
    handlePitClick,
    isValidPit,
  };
};
// useSungkaGameLogic.jsx