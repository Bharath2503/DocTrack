import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AddApplicant from "./AddApplicant/AddApplicant";
import "./App.css";
import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="app">
        <AddApplicant />
      </div>
    </>
  );
}

export default App;
