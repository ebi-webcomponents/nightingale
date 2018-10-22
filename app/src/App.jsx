import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce";

import HomePage from "./HomePage";
import ProtvistaTrack from "./components/ProtvistaTrack";
import ProtvistaSequence from "./components/ProtvistaSequence";
import ProtvistaVariation from "./components/ProtvistaVariation";
import ProtvistaStructure from "./components/ProtvistaStructure";
import ProtvistaNavigation from "./components/ProtvistaNavigation";
import ProtvistaManager from "./components/ProtvistaManager";

import "./App.css";

const App = () => (
  <Router>
    <div className="App">
      <div className="App-header">
        <div className="logo">
          <h2>Nightingale</h2>
        </div>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li>
              <Link to="/track">Track</Link>
            </li>
            <li>
              <Link to="/sequence">Sequence</Link>
            </li>
            <li>
              <Link to="/variation">Variation</Link>
            </li>
            <li>
              <Link to="/structure">Structure</Link>
            </li>
            <li>
              <Link to="/navigation">Navigation</Link>
            </li>
            <li>
              <Link to="/manager">Manager</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <Route path="/" exact component={HomePage} />
        <Route path="/track" component={ProtvistaTrack} />
        <Route path="/sequence" component={ProtvistaSequence} />
        <Route path="/variation" component={ProtvistaVariation} />
        <Route path="/structure" component={ProtvistaStructure} />
        <Route path="/navigation" component={ProtvistaNavigation} />
        <Route path="/manager" component={ProtvistaManager} />
      </div>
    </div>
  </Router>
);

export default App;
