import React from 'react';
import './App.css';
import Navbar from "./components/navbar";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import openLayerMap from "./components/openLayerMap";

function App() {
    return (
        <Router>
            <React.Fragment>
                <Navbar>
                </Navbar>
                <Switch>
                    <Route path="/" exact component={openLayerMap}/>
                </Switch>
            </React.Fragment>
        </Router>
    );
}

export default App;
