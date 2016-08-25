import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import StartPage from '../layouts/StartPage/StartPage';
import App from '../components/App';
import Start from '../components/Start/Start';
import Upload from '../components/Upload/Upload';
import NotFound from '../components/NotFound';
import Adjust from '../components/Adjust/Adjust';
import Mark from '../components/Mark/Mark';
import Results from '../components/Results/Results';
// import Cloth from '../components/Cloth/Cloth';

import Three from '../components/react-three/app';

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/index" component={StartPage}>
    </Route>
    <Route path="/" component={App}>
      <IndexRoute component={Start} />
      <Route path="upload_:username" component={Upload} />
      <Route path="adjust_:username" component={Adjust} />
      <Route path="mark_:username" component={Mark} />
      <Route path="results_:username" component={Results} />
      <Route path="other" component={NotFound} />
      <Route path="1" component={NotFound} />
      <Route path="2" component={NotFound} />
      <Route path="3" component={NotFound} />
      <Route path="4" component={NotFound} />
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
