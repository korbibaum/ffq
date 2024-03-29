/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes, { shape, string } from 'prop-types';
import { authService } from '../../services';
// import { authenticationService } from '../../services';

/**
 * * PrivateRoute
 * A wrapper for <Route> that redirects to the login
 * screen if you're not yet authenticated.
 */
const PrivateRoute = ({ location, roles, isAdmin, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        const { currentUserValue } = authService;
        if (!currentUserValue) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          );
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUserValue.roles[0]) === -1) {
          // role not authorised so redirect to home page
          return <Redirect to={{ pathname: `/users/${currentUserValue.id}` }} />;
        }

        // authorised so return component
        if (location.state && location.state.question) {
          const { questionnaireId, question } = location.state;
          return (
            <Component isAdmin={isAdmin} question={question} questionnaireId={questionnaireId} />
          );
        }
        return <Component isAdmin={isAdmin} />;
      }}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    id: string,
    pathname: string,
    search: string,
    hash: string,
    state: shape({})
  })
};

PrivateRoute.defaultProps = {
  roles: null,
  isAdmin: false,
  location: {
    id: '',
    pathname: '/',
    search: '',
    hash: ''
  }
};

export default PrivateRoute;
