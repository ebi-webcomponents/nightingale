import React, { Fragment, Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import "@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce";

const ProtvistaTrack = lazy(() => import("./components/ProtvistaTrack"));
const ProtvistaSequence = lazy(() => import("./components/ProtvistaSequence"));
const ProtvistaVariation = lazy(() =>
  import("./components/ProtvistaVariation")
);
const ProtvistaStructure = lazy(() =>
  import("./components/ProtvistaStructure")
);
const ProtvistaNavigation = lazy(() =>
  import("./components/ProtvistaNavigation")
);
const ProtvistaManager = lazy(() => import("./components/ProtvistaManager"));
const InteractionViewer = lazy(() => import("./components/InteractionViewer"));
const Playground = lazy(() => import("./components/Playground"));
import pkg from "../package.json";

import "./App.css";

const App = (component = ProtvistaNavigation) => (
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
            <ul className="main-nav__list">
              <li>
                <NavLink to="/playground">Playground Area</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="main-content">
          {/*<Redirect from="/" to="/track" />*/}
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/track" component={ProtvistaTrack} />
              <Route path="/sequence" component={ProtvistaSequence} />
              <Route path="/variation" component={ProtvistaVariation} />
              <Route path="/structure" component={ProtvistaStructure} />
              <Route path="/navigation" component={ProtvistaNavigation} />
              <Route path="/manager" component={ProtvistaManager} />
              <Route path="/interaction-viewer" component={InteractionViewer} />
              <Route path="/playground" component={Playground} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
