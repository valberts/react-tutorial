import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" style={props.style} onClick={props.onClick}>
            {props.value}
        </button>   
    )
}
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
            style={{'background-color': this.props.winners.includes(i) ? "#fff29e" : "#fff"}}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      moveList: [],
      winners: [],
      //style: {'background-color': true ? "#fff29e" : "#fff"}
    };
  }

  handleClick(i) {    
    const history = this.state.history;
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if (calculateWinner(squares, this) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      moveList: this.state.moveList.concat(i)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    }); 
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + (this.state.moveList[move-1]%3 + 1) + ', ' + (Math.floor(this.state.moveList[move-1]/3) + 1) + ')':
        'Go to game start';
      return (
        <li key = {move} style = {{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}}>
          <button onClick={() => this.jumpTo(move)} style = {{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}}>{ desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else if (history.length === 10 && this.state.stepNumber === 9) {
      status = 'Draw.';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            winners = {this.state.winners}
            //style = {this.style}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, game) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        game.state.winners = lines[i];
        return squares[a];
      }
    }
    return null;
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  