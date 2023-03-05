import styles from './Game.module.scss';
import Board from '../Board/Board.jsx';
import { useEffect, useState } from 'react';
import { initBoard } from '../../utils/index.js';
import classNames from 'classnames';

const Game = ({ data }) => {
  const [gameStatus, setGameStatus] = useState('start');
  const [grid, setGrid] = useState(() => initBoard(data));
  const [mineCount, setMineCount] = useState(data.mines);
  const [seconds, setSeconds] = useState(0);
  const [isTimeActive, setIsTimeActive] = useState(true);
  const [needReset, setNeedReset] = useState(false);
  const [changeSmile, setChangeSmile] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isTimeActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    if ((!isTimeActive && seconds !== 0) || seconds >= 999) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimeActive, seconds]);

  useEffect(() => {
    if (gameStatus !== 'start') {
      setIsTimeActive(false);
    }
    if (gameStatus === 'win') {
      setIsTimeActive(true);
    }
  }, [gameStatus]);

  const resetGame = setupData => {
    setGameStatus('start');
    setGrid(initBoard(setupData));
    setMineCount(data.mines);
    setNeedReset(true);
    setSeconds(0);
    setIsTimeActive(true);
  };

  function makeArr(arg) {
    const arr = Array.from(String(arg));
    if (arg < 10) {
      arr.unshift(0, 0);
    } else if (arg < 100) {
      arr.unshift(0);
    }
    return arr;
  }

  return (
    <div className={[styles.game, 'paper'].join(' ')}>
      <div className={styles.control}>
        <div className={styles.scoreboard}>
          {makeArr(mineCount).map((i, key) => (
            <span
              key={key}
              className={classNames(
                styles.numbers,
                i == 0 ? styles.numbers_zero : '',
                i == 1 ? styles.numbers_one : '',
                i == 2 ? styles.numbers_two : '',
                i == 3 ? styles.numbers_three : '',
                i == 4 ? styles.numbers_four : '',
                i == 5 ? styles.numbers_five : '',
                i == 6 ? styles.numbers_six : '',
                i == 7 ? styles.numbers_seven : '',
                i == 8 ? styles.numbers_eight : '',
                i == 9 ? styles.numbers_nine : ''
              )}
            ></span>
          ))}
        </div>
        <button
          onClick={() => resetGame(data)}
          className={classNames(
            styles.status__button,
            gameStatus === 'start' ? styles.status__button_normal : '',
            gameStatus === 'win' ? styles.status__button_win : '',
            gameStatus === 'lose' ? styles.status__button_lose : '',
            changeSmile ? styles.status__button_affraid : ''
          )}
        ></button>
        <div className={styles.scoreboard}>
          {makeArr(seconds).map((i, key) => (
            <span
              key={key}
              className={classNames(
                styles.numbers,
                i == 0 ? styles.numbers_zero : '',
                i == 1 ? styles.numbers_one : '',
                i == 2 ? styles.numbers_two : '',
                i == 3 ? styles.numbers_three : '',
                i == 4 ? styles.numbers_four : '',
                i == 5 ? styles.numbers_five : '',
                i == 6 ? styles.numbers_six : '',
                i == 7 ? styles.numbers_seven : '',
                i == 8 ? styles.numbers_eight : '',
                i == 9 ? styles.numbers_nine : ''
              )}
            ></span>
          ))}
        </div>
      </div>
      <Board
        data={data}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
        grid={grid}
        setGrid={setGrid}
        mineCount={mineCount}
        setMineCount={setMineCount}
        needReset={needReset}
        setNeedReset={setNeedReset}
        setChangeSmile={setChangeSmile}
      />
    </div>
  );
};

export default Game;
