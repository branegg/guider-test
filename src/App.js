import './App.scss';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Calendar from './components/Calendar/Calendar';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/' exact>
            <Link className='App__link' to='/calendar'>
              {`--> Calendar <--`}
            </Link>
          </Route>
          <Route path='/calendar'>
            <Calendar />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
