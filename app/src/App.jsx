import React, { Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Switch,
  Link
} from "react-router-dom";
import "@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce";
import pkg from "../package.json";
import logo from "../resources/nightingale_logo.svg";
import "./App.css";
import GettingStarted from "./tutorial/GettingStarted";
import ProtvistaTooltip from "./components/ProtvistaTooltip.jsx";
import ProtvistaTooltipWrapper from "./components/ProtvistaTooltip.jsx";

const ProtvistaTrack = lazyImport("ProtvistaTrack");
const ProtvistaInterProTrack = lazyImport("ProtvistaInterProTrack");
const ProtvistaSequence = lazyImport("ProtvistaSequence");
const ProtvistaColouredSequence = lazyImport("ProtvistaColouredSequence");
const ProtvistaVariation = lazyImport("ProtvistaVariation");
const ProtvistaStructure = lazyImport("ProtvistaStructure");
const ProtvistaNavigation = lazyImport("ProtvistaNavigation");
const ProtvistaManager = lazyImport("ProtvistaManager");
const InteractionViewer = lazyImport("InteractionViewer");
const ProtvistaFilter = lazyImport("ProtvistaFilter");
const ProtvistaDatatable = lazyImport("ProtvistaDatatable");
const Playground = lazyImport("Playground");
const ProtvistaVariationGraph = lazyImport("ProtvistaVariationGraph");
const ProtvistaMSA = lazyImport("ProtvistaMSA");
const TextareaSequence = lazyImport("TextareaSequence");

function lazyImport(name) {
  return lazy(() => import(`./components/${name}`));
}

const App = (component = ProtvistaNavigation) => (
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
                <NavLink to="/" exact activeClassName="active">
                  Getting started
                </NavLink>
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
              <Route path="/track" component={ProtvistaTrack} />
              <Route
                path="/interpro-track"
                component={ProtvistaInterProTrack}
              />
              <Route path="/sequence" component={ProtvistaSequence} />
              <Route
                path="/coloured-sequence"
                component={ProtvistaColouredSequence}
              />
              <Route path="/variation" component={ProtvistaVariation} />
              <Route path="/structure" component={ProtvistaStructure} />
              <Route path="/navigation" component={ProtvistaNavigation} />
              <Route path="/manager" component={ProtvistaManager} />
              <Route path="/interaction-viewer" component={InteractionViewer} />
              <Route path="/filter" component={ProtvistaFilter} />
              <Route path="/graph" component={ProtvistaVariationGraph} />
              <Route path="/datatable" component={ProtvistaDatatable} />
              <Route path="/playground" component={Playground} />
              <Route path="/tooltip" component={ProtvistaTooltipWrapper} />
              <Route path="/msa" component={ProtvistaMSA} />
              <Route path="/textarea-sequence" component={TextareaSequence} />
              <Route path="/" component={GettingStarted} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
