import React from 'react';
import classNames from 'classnames';
import styles from './Cell.module.scss';

const Cell = ({ col, i, j, onLClick, onRClick, gameStatus, currentCell, setCurrentCell }) => {
  function disableOnClick(e, i, j) {
    if (gameStatus === 'lose') {
      return;
    } else {
      onLClick(e, i, j);
      setCurrentCell([i, j]);
    }
  }
  const getStyle = cellData => {
    const { isMine, neighbors } = cellData;
    if (
      isMine &&
      gameStatus === 'lose' &&
      cellData.x === currentCell[0] &&
      cellData.y === currentCell[1]
    )
      return styles.shown_bomb_blowup;
    else if (isMine && gameStatus === 'lose' && cellData.flagIndex === 1)
      return styles.shown_bomb_finded;
    else if (isMine) return styles.shown_bomb;
    else if (neighbors === 1) return styles.shown_one;
    else if (neighbors === 2) return styles.shown_two;
    else if (neighbors === 3) return styles.shown_three;
    else if (neighbors === 4) return styles.shown_four;
    else if (neighbors === 5) return styles.shown_five;
    else if (neighbors === 6) return styles.shown_six;
    else if (neighbors === 7) return styles.shown_seven;
    else if (neighbors === 8) return styles.shown_eight;
  };
  return (
    <div
      className={
        col.isOpen
          ? [styles.cell, styles.shown].join(' ')
          : col.flagIndex
          ? col.flagIndex === 1
            ? styles.shown_flag
            : styles.shown_question
          : [styles.cell, styles.hidden].join(' ')
      }
      data-dimension={`${i}-${j}`}
      onClick={e => {
        disableOnClick(e, i, j);
      }}
      onContextMenu={e => onRClick(e, i, j)}
    >
      <span className={classNames(styles.cell__size, col.isOpen ? getStyle(col) : '')}></span>
    </div>
  );
};

export default Cell;
