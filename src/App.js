import './App.css';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Calendar from './components/Calendar/Calendar';

const App = () => {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetch('/availability')
      .then(res => res.json())
      .then(res => setAvailability(res));
  }, []);

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
