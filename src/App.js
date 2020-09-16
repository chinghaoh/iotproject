import React from 'react';
import './App.css';
import Navbar from "./components/navbar";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Googlemaps from "./components/openLayerMap";
import Table from "./components/table";
import Graph from "./components/graph";

function App() {
    return (
        <Router>
            <React.Fragment>
                <Navbar>
                </Navbar>
                <Switch>
                    <Route path="/" exact component={Googlemaps}/>
                    <Route path="/table" component={Table}/>
                    <Route path="/graph" component={Graph}/>
                </Switch>
            </React.Fragment>
        </Router>
    );
}

export default App;
