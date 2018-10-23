import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import "@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce";

import ProtvistaTrack from "./components/ProtvistaTrack";
import ProtvistaSequence from "./components/ProtvistaSequence";
import ProtvistaVariation from "./components/ProtvistaVariation";
import ProtvistaStructure from "./components/ProtvistaStructure";
import ProtvistaNavigation from "./components/ProtvistaNavigation";
import ProtvistaManager from "./components/ProtvistaManager";
import InteractionViewer from "./components/InteractionViewer";
import pkg from "../package.json";

import "./App.css";

const App = () => (
  <Router>
    <div className="App">
      <div className="App-header">
        <div className="logo">
          <h2>
            Nightingale&nbsp;
            <small>{pkg.version}</small>
          </h2>
        </div>
      </div>
      <div className="main">
        <div>
          <nav className="main-nav">
            <ul className="main-nav__list">
              <li>
                <NavLink to="/track" activeClassName="active">
                  Track
                </NavLink>
              </li>
              <li>
                <NavLink to="/sequence" activeClassName="active">
                  Sequence
                </NavLink>
              </li>
              <li>
                <NavLink to="/variation" activeClassName="active">
                  Variation
                </NavLink>
              </li>
              <li>
                <NavLink to="/structure" activeClassName="active">
                  Structure
                </NavLink>
              </li>
              <li>
                <NavLink to="/navigation" activeClassName="active">
                  Navigation
                </NavLink>
              </li>
              <li>
                <NavLink to="/manager" activeClassName="active">
                  Manager
                </NavLink>
              </li>
              <li>
                <NavLink to="/interaction-viewer">Interaction viewer</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="main-content">
          <Redirect from="/" to="/track" />
          <Route path="/track" component={ProtvistaTrack} />
          <Route path="/sequence" component={ProtvistaSequence} />
          <Route path="/variation" component={ProtvistaVariation} />
          <Route path="/structure" component={ProtvistaStructure} />
          <Route path="/navigation" component={ProtvistaNavigation} />
          <Route path="/manager" component={ProtvistaManager} />
          <Route path="/interaction-viewer" component={InteractionViewer} />
        </div>
      </div>
    </div>
  </Router>
);

export default App;
