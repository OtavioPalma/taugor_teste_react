import { Switch } from 'react-router-dom';
import { Activity } from '../pages/Activity/Activity';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { SignIn } from '../pages/SignIn/SignIn';
import { SignUp } from '../pages/SignUp/SignUp';
import { Route } from './Route';

export const Routes: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/dashboard" component={Dashboard} isPrivate />
        <Route path="/activity/:id" component={Activity} isPrivate />
      </Switch>
    </>
  );
};
