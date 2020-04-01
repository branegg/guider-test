import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Calendar from './components/Calendar/Calendar';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/calendar'>
            <Calendar />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
