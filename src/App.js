import React from 'react';
import './App.css';
import TetrisGame from "./components/TetrisGame";

function App() {
  return (
    <div className="App">
      <TetrisGame rows={30} columns={15} />
    </div>
  );
}

export default App;
