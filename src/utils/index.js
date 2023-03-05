import { produce } from 'immer';

// Генерация случайных позиций мин
export const generateRandomMines = (
  data = [],
  height = 0,
  width = 0,
  mines = 0,
  exception = [0, 0]
) => {
  let minesPlanted = 0;
  while (minesPlanted < mines) {
    let randomX = Math.floor(Math.random() * width);
    let randomY = Math.floor(Math.random() * height);

    if (!data[randomX][randomY].isMine && randomX !== exception[0] && randomY !== exception[1]) {
      data[randomX][randomY].isMine = true;
      minesPlanted += 1;
    }
  }
  return data;
};

// Получение соседей клетки
export const getNeighbors = (i = 0, j = 0, data = [], height = 0, width = 0) => {
  const neighbors = [];
  const surroundings = [
    [-1, -1], // Левый верхний
    [-1, 0], // Центральный верхний
    [-1, 1], // и т.д.
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];

  surroundings.forEach(([x, y]) => {
    const newX = i + x;
    const newY = j + y;
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      neighbors.push(data[newX][newY]);
    }
  });

  return neighbors;
};

// Генерация соседей
export const generateNeighbors = (data = [], height = 0, width = 0) => {
  const dataCopy = data;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let mines = 0;
      const area = getNeighbors(data[i][j].x, data[i][j].y, data, height, width);
      area.map(value => {
        if (value.isMine) {
          return (mines += 1);
        }
        return 0;
      });
      if (!mines) {
        dataCopy[i][j].isEmpty = true;
      }
      dataCopy[i][j].neighbors = mines;
    }
  }
  return dataCopy;
};

// Инициализация поля
export const initBoard = setupData => {
  const { width, height, mines } = setupData;
  const array2D = Array(width)
    .fill(0)
    .map((_, indexH) =>
      Array(height)
        .fill(null)
        .map((_, indexW) => ({
          x: indexH,
          y: indexW,
          isMine: false,
          neighbors: 0,
          isEmpty: false,
          isOpen: false,
          flagIndex: 0 // 0 - пустая ячейка, 1 - флажок, 2 - вопросительный знак
        }))
    );

  // const arrayWithMines = generateRandomMines(array2D, height, width, mines);
  // return generateNeighbors(arrayWithMines, height, width);

  return array2D;
};

// Показ пустых ячеек
export const showEmptyCells = (height, width, x, y, data) => {
  const neighbors = getNeighbors(x, y, data, height, width);

  neighbors.map(cell => {
    if (!cell.isOpen && (cell.isEmpty || !cell.isMine) && cell.flagIndex === 0) {
      Object.assign(data[cell.x][cell.y], { isOpen: true });
      if (cell.isEmpty) {
        showEmptyCells(height, width, cell.x, cell.y, data);
      }
    }
    return null;
  });

  return data;
};

// Раскрытие игрового поля при поражении
export const showGridLose = data => {
  return produce(data, draft =>
    draft.map(row =>
      row.map(cell => {
        return { ...cell, isOpen: true };
      })
    )
  );
};

// Раскрытие игрового поля при победе
export const showGridWin = data => {
  return produce(data, draft =>
    draft.map(row =>
      row.map(cell => {
        if (cell.isMine) {
          return { ...cell, isOpen: false, flagIndex: 1 };
        }
        return { ...cell, isOpen: true };
      })
    )
  );
};
