import React from 'react';
import {
  Redirect,
  Route as ReactRouteRoute,
  RouteProps as ReactRouteProps,
} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RouteProps extends ReactRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

export const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactRouteRoute
      {...rest}
      render={({ location }) =>
        isPrivate === Boolean(user) ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
