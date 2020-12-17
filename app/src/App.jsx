import React, { Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
} from "react-router-dom";

import logo from "../resources/nightingale_logo.svg";
import "./App.css";
import GettingStarted, {
  CreateComponent,
  CreateAdapter,
} from "./tutorial/GettingStarted";

import NightingaleTooltipWrapper from "./components/NightingaleTooltip.jsx";

const NightingaleTrack = lazyImport("NightingaleTrack");
const NightingaleInterProTrack = lazyImport("NightingaleInterProTrack");
const NightingaleSequence = lazyImport("NightingaleSequence");
const NightingaleColouredSequence = lazyImport("NightingaleColouredSequence");
const NightingaleVariation = lazyImport("NightingaleVariation");
const NightingaleStructure = lazyImport("NightingaleStructure");
const NightingaleNavigation = lazyImport("NightingaleNavigation");
const NightingaleManager = lazyImport("NightingaleManager");
const InteractionViewer = lazyImport("NightingaleInteractionViewer");
const NightingaleFilter = lazyImport("NightingaleFilter");
const NightingaleDatatable = lazyImport("NightingaleDatatable");
const Playground = lazyImport("Playground");
const NightingaleVariationGraph = lazyImport("NightingaleVariationGraph");
const NightingaleMSA = lazyImport("NightingaleMSA");
const TextareaSequence = lazyImport("TextareaSequence");

function lazyImport(name) {
  return lazy(() => import(`./components/${name}`));
}

const App = () => (
  <Router>
    <div className="App">
      <div className="App-header">
        <div className="logo">
          <Link to="/">
            <span
              className="logo--container"
              dangerouslySetInnerHTML={{ __html: logo }}
            />
            <span className="logo--title">Nightingale</span>
          </Link>
        </div>
        <div className="header-nav">
          <a href="//www.github.com/ebi-webcomponents/nightingale">Github</a>
        </div>
      </div>
      <div className="main">
        <div>
          <nav className="main-nav">
            <ul className="main-nav__list">
              <li>
                <h3>Tutorials</h3>
                <ul className="main-nav__list">
                  <li>
                    <NavLink to="/" exact activeClassName="active">
                      Getting started
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/create-component"
                      exact
                      activeClassName="active"
                    >
                      Create a component
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/create-adapter"
                      exact
                      activeClassName="active"
                    >
                      Create an Adapter
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <h3>Components</h3>
                <ul className="main-nav__list">
                  <li>
                    <NavLink to="/track" activeClassName="active">
                      Track
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/interpro-track" activeClassName="active">
                      InterPro Track
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/sequence" activeClassName="active">
                      Sequence
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/coloured-sequence" activeClassName="active">
                      Coloured Sequence
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
                    <NavLink to="/interaction-viewer">
                      Interaction viewer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/filter">Filter</NavLink>
                  </li>
                  <li>
                    <NavLink to="/graph">Variation Graph</NavLink>
                  </li>
                  <li>
                    <NavLink to="/datatable">Data table</NavLink>
                  </li>
                  <li>
                    <NavLink to="/tooltip">Tooltip</NavLink>
                  </li>
                  <li>
                    <NavLink to="/msa">Alignments</NavLink>
                  </li>
                  <li>
                    <NavLink to="/textarea-sequence">Textarea Sequence</NavLink>
                  </li>
                </ul>
                <ul className="main-nav__list">
                  <li>
                    <NavLink to="/playground">Playground Area</NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div className="main-content">
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/track" component={NightingaleTrack} />
              <Route
                path="/interpro-track"
                component={NightingaleInterProTrack}
              />
              <Route path="/sequence" component={NightingaleSequence} />
              <Route
                path="/coloured-sequence"
                component={NightingaleColouredSequence}
              />
              <Route path="/variation" component={NightingaleVariation} />
              <Route path="/structure" component={NightingaleStructure} />
              <Route path="/navigation" component={NightingaleNavigation} />
              <Route path="/manager" component={NightingaleManager} />
              <Route path="/interaction-viewer" component={InteractionViewer} />
              <Route path="/filter" component={NightingaleFilter} />
              <Route path="/graph" component={NightingaleVariationGraph} />
              <Route path="/datatable" component={NightingaleDatatable} />
              <Route path="/playground" component={Playground} />
              <Route path="/tooltip" component={NightingaleTooltipWrapper} />
              <Route path="/msa" component={NightingaleMSA} />
              <Route path="/textarea-sequence" component={TextareaSequence} />
              <Route path="/create-component" component={CreateComponent} />
              <Route path="/create-adapter" component={CreateAdapter} />
              <Route path="/" component={GettingStarted} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
