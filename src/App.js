import { useState, useEffect, useCallback } from 'react';
import './Styles.scss';

function App() {
  const [spaceArray, setSpaceArray] = useState([
    [1, 2, 3],
    [8, 5, 6],
    [7, 8, 8],
  ]);

  const [currentValue, setCurrentValue] = useState(0);
  const [currentSelection, setCurrentSelection] = useState([0, 0]);
  const [youWon, setYouWon] = useState(false);
  const [moveCounter, setMoveCounter] = useState(0);

  const checkWinCondition = useCallback(() => {
    const spaceDictionary = {};
    let breakout = false;
    for (let i = 0; i < spaceArray.length; i++) {
      for (let j = 0; j < spaceArray[i].length; j++) {
        if (spaceDictionary[spaceArray[i][j]]) {
          breakout = true;
          break;
        } else {
          spaceDictionary[spaceArray[i][j]] = 1;
        }
      }
      if (breakout) {
        break;
      }
    }
    if (!breakout) {
      setYouWon(true);
    }
  }, [spaceArray]);

  const populateArray = useCallback(() => {
    const freshArray = [];
    for (let i = 0; i < 3; i++) {
      const arrayRow = Array(3)
        .fill()
        .map(() => Math.round(1 + Math.random() * 8));
      freshArray.push(arrayRow);
    }
    checkWinCondition(freshArray);
    setSpaceArray(freshArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAllActive = () => {
    const toClear = document.querySelectorAll('.board .cell');
    for (let i = 0; i < toClear.length; i++) {
      toClear[i].classList.remove('active');
    }
  };

  const handleCellClick = (e, i, j) => {
    if (
      !youWon &&
      JSON.stringify(currentSelection) !== JSON.stringify([i, j])
    ) {
      clearAllActive();
      e.target.classList.toggle('active');
      const cellValue = spaceArray[i][j];
      const halfValue = Math.ceil(currentValue / 2);
      if (cellValue === currentValue && cellValue !== 9) {
        spaceArray[i][j] = cellValue + 1;
        spaceArray[currentSelection[0]][currentSelection[1]] = halfValue;
        setCurrentValue(currentValue + 1);
        setMoveCounter(moveCounter + 1);
        checkWinCondition();
      } else if (cellValue === currentValue && cellValue === 9) {
        spaceArray[currentSelection[0]][currentSelection[1]] = halfValue;
        setCurrentValue(cellValue);
        setMoveCounter(moveCounter + 1);
        checkWinCondition();
      } else {
        setCurrentValue(cellValue);
      }
      setCurrentSelection([i, j]);
    }
  };

  useEffect(() => {
    populateArray();
  }, [populateArray]);

  useEffect(() => {
    checkWinCondition();
  }, [checkWinCondition]);

  return (
    <div className='App'>
      <h1>
        <span className='red'>Nine</span>Square
      </h1>
      <div className='instructions'>
        <p>Select a square of the nine!</p>
        <p>
          When you match a number on another square, it increases by 1, and the
          previous number is cut in half and rounded up.
        </p>
        <p>
          Try to get the numbers{' '}
          <span className='gold'>1, 2, 3, 4, 5, 6, 7, 8, 9</span> on the board,
          in no order, with the least amount of moves.
        </p>
      </div>
      <div className='game'>
        <div className={`board ${youWon ? 'winner' : ''}`}>
          {spaceArray.map((row, i) => (
            <div className='row' key={i}>
              {row.map((cell, j) => (
                <div
                  className='cell'
                  key={j}
                  onClick={(e) => {
                    handleCellClick(e, i, j);
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <h3>Move: {moveCounter}</h3>
        {youWon ? (
          <div className='you-won-popup'>
            <h2>You Won!!!</h2>
            <p>In {moveCounter} moves! Congratulations! 🎉</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
