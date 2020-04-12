import React from 'react';
import './App.css';
import TetrisGame from "./components/TetrisGame";

function App() {
  return (
    <div className="App">
      <TetrisGame rows={20} columns={10} />
    </div>
  );
}

export default App;
