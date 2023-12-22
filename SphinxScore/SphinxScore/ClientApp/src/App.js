import React from 'react';
import './custom.css';
import Home from "./components/Home";
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
    console.log("heree")
    return (
        <BrowserRouter>
            <Route index component={Home} />
        </BrowserRouter>
    );
}

export default App;

