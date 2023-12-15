import React from 'react';
import './custom.css';
import Home from "./components/Home";
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Route index component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
        </BrowserRouter>
    );
}

export default App;

