import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import HomePage from "./pages/home";
import StatisticPage from "./pages/statistic";

const App: React.VFC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/stats" component={StatisticPage} />
      </Switch>
    </Router>
  );
};

export default App;
