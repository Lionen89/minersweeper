import './styles/App.scss';
import Game from './components/Game/Game.jsx';

function App() {
  const size = 16;
  const mines = 40;
  return (
    <div className="wrapper">
      <div className="container app">
        <Game
          data={{
            width: size,
            height: size,
            mines: mines
          }}
        />
      </div>
    </div>
  );
}

export default App;
