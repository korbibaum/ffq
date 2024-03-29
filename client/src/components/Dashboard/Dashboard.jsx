import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

// helpers
import { Role } from '../../helpers';

// Root Pages that can be routed to
import {
  HomePage,
  QuestionnaireEditorPage,
  QuestionnairePresenterPage,
  ParticipantsManagementPage,
  AccountPage,
  LoginPage
} from '../../pages';

// components
import PrivateRoute from '../PrivateRoute';
import NavBar from './NavBar';

const Dashboard = ({ isAdmin }) => {
  const { path } = useRouteMatch();
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const DefaultNavBarContainer = () => {
    return (
      <>
        <NavBar isAdmin={isAdmin} />
        <PrivateRoute
          path={`${path}/questionnaireEditor`}
          roles={[Role.Admin]}
          isAdmin={isAdmin}
          component={QuestionnaireEditorPage}
        />
        <PrivateRoute
          path={`${path}/participantsManager`}
          roles={[Role.Admin]}
          isAdmin={isAdmin}
          component={ParticipantsManagementPage}
        />
        <Route path={`${path}/account`} component={() => <AccountPage isAdmin={isAdmin} />} />
        <Route exact path={`${path}/`} component={() => <HomePage isAdmin={isAdmin} />} />
      </>
    );
  };

  return (
    <div style={{ minWidth: '300px' }}>
      <main role="main" className="col p-0">
        {user && (
          <div className="row no-gutters">
            <div className="col">
              <Switch>
                <Route
                  path={`${path}/questionnairePresenter/iteration/:iterationId`}
                  component={() => <QuestionnairePresenterPage isAdmin={isAdmin} />}
                />
                <Route exact component={DefaultNavBarContainer} />
                <Route path="*" component={LoginPage} />
              </Switch>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired
};

export default Dashboard;
