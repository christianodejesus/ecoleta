import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import CreatePoint from './pages/CreatePoint';
import Home from './pages/Home';
import Success from './pages/Success';


const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" exact />
      <Route component={Success} path="/success" exact />
    </BrowserRouter>
  );
}

export default Routes;
