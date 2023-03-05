import styles from './Board.module.scss';
import React from 'react';
import Cell from '../UI/Cell/Cell.jsx';
import { produce } from 'immer';
import { showEmptyCells, showGridLose, showGridWin } from '../../utils/index.js';
import { generateRandomMines, generateNeighbors } from '../../utils/index.js';

const Board = React.memo(props => {
  const {
    data,
    gameStatus,
    setGameStatus,
    grid,
    setGrid,
    mineCount,
    setMineCount,
    needReset,
    setNeedReset,
    setChangeSmile
  } = props;

  const [firstStep, setFirstStep] = React.useState(true);
  const [currentCell, setCurrentCell] = React.useState([]);

  const onLeftClick = (e, x, y) => {
    if (firstStep || needReset) {
      generateNeighbors(
        generateRandomMines(grid, data.height, data.width, data.mines, [x, y]),
        data.height,
        data.width
      );
      setFirstStep(false);
      setNeedReset(false);
    }

    if (grid[x][y].isOpen || grid[x][y].flagIndex > 0 || gameStatus !== 'start') {
      return;
    }

    const updatedGrid = produce(grid, draft => {
      Object.assign(draft[x][y], { isOpen: true });
      if (draft[x][y].isEmpty) {
        showEmptyCells(data.height, data.width, x, y, draft);
      }
    });

    // Поражение
    if (updatedGrid[x][y].isMine) {
      const openedGrid = showGridLose(updatedGrid);
      setGrid(openedGrid);
      setGameStatus('lose');
      return;
    }

    // Победа
    const hiddenGrid = updatedGrid.flat().filter(cell => !cell.isOpen);
    if (hiddenGrid.length === data.mines) {
      const finalGrid = showGridWin(updatedGrid);
      setGrid(finalGrid);
      setMineCount(0);
      setGameStatus('win');
      return;
    }

    setGrid(updatedGrid);
  };

  const onRightClick = (e, x, y) => {
    e.preventDefault();
    if (grid[x][y].isOpen || gameStatus !== 'start') return;

    let mineCountPlaceholder = mineCount;
    const updatedGrid = produce(grid, draft => {
      draft[x][y].flagIndex = draft[x][y].flagIndex > 1 ? 0 : draft[x][y].flagIndex + 1;

      draft[x][y].flagIndex === 1 && (mineCountPlaceholder -= 1);
      draft[x][y].flagIndex === 2 && (mineCountPlaceholder += 1);

      setMineCount(mineCountPlaceholder);
    });

    setGrid(updatedGrid);
  };

  return (
    <div
      onMouseDown={e => {
        if (e.button === 0 && gameStatus === 'start') {
          setChangeSmile(true);
        }
      }}
      onMouseUp={e => {
        if (e.button === 0 && gameStatus === 'start') {
          setChangeSmile(false);
        }
      }}
      className={styles.board}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${data.height}, 1fr)`, //колонки
        gridTemplateRows: `repeat(${data.width}, 1fr)` //строки
      }}
    >
      {grid.map((row, i) =>
        row.map((col, j) => (
          <Cell
            key={`${i}-${j}`}
            col={col}
            i={i}
            j={j}
            onLClick={(e, i, j) => onLeftClick(e, i, j)}
            onRClick={(e, i, j) => onRightClick(e, i, j)}
            gameStatus={gameStatus}
            currentCell={currentCell}
            setCurrentCell={setCurrentCell}
          />
        ))
      )}
    </div>
  );
});

export default Board;
