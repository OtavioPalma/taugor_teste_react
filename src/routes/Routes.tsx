import { Route, Switch } from 'react-router-dom';
import { SignIn } from '../pages/SignIn/SignIn';

export const Routes: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={SignIn} />
      </Switch>
    </>
  );
};
