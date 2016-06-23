import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import StartPage from '../layouts/StartPage/StartPage';
import App from '../components/App';
import Start from '../components/Start/Start';
import Upload from '../components/Upload/Upload';
import NotFound from '../components/NotFound';

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/" component={StartPage}>
    </Route>
    <Route path="/authed" component={App}>
      <Route path="/start" component={Start}/>
      <Route path="/upload" component={Upload} />
      <Route path="/adjust" component={NotFound} />
      <Route path="/results" component={NotFound} />
      <Route path="/other" component={NotFound} />
      <Route path="/1" component={NotFound} />
      <Route path="/2" component={NotFound} />
      <Route path="/3" component={NotFound} />
      <Route path="/4" component={NotFound} />
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
