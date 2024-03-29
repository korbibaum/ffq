/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

// services
import { userService } from '../../../services';

// components
import { ConsentScreeningModal } from '../../../components/Modals';

const UserApproval = ({
  user,
  questionnaire,
  screeningStatus,
  setScreeningStatus,
  setHasAcceptedConsentForm,
  start
}) => {
  const isMeetingRule = (rule, userSelection) => {
    if (rule.operator === 'AND') {
      return rule.criteria.every((criterion) => userSelection.includes(criterion));
    }

    return userSelection.some((selection) => rule.criteria.includes(selection));
  };

  const updateScreeningStatus = (rules, userSelection) => {
    const metRule = rules.find((rule) => {
      return isMeetingRule(rule, userSelection);
    });
    if (metRule) {
      userService.updateUserData(user.id, { screeningStatus: metRule.decision }).then(() => {
        setScreeningStatus(metRule.decision);
        if (metRule.decision === 'Accept') {
          start();
        }
      });
      return;
    }
    userService.updateUserData(user.id, { screeningStatus: 'Accept' }).then(() => {
      setScreeningStatus('Accept');
      start();
    });
  };

  return (
    <div>
      {screeningStatus === 'Wait' && (
        <div className="alert alert-info text-center m-3" role="alert">
          Ihre Angaben werden noch manuell geprüft. Kommen Sie bitte später zurück um den Fragebogen
          zu bearbeiten.
        </div>
      )}
      {screeningStatus === 'Reject' && (
        <div className="alert alert-info text-center m-3" role="alert">
          Aufgrund ihrer Angaben eignen Sie sich leider nicht für diese Umfgrage.
        </div>
      )}
      <ConsentScreeningModal
        consentScript={questionnaire.consentScript}
        selectionCriteria={questionnaire.selectionCriteria}
        hasAcceptedConsentForm={user.hasAcceptedConsentForm}
        onAccept={() =>
          userService.updateUserData(user.id, { hasAcceptedConsentForm: true }).then(() => {
            setHasAcceptedConsentForm(true);
          })
        }
        onDone={(screeningData) => {
          userService.updateUserData(user.id, { screeningData }).then(() => {
            updateScreeningStatus(questionnaire.screeningRules, screeningData);
          });
        }}
      />
    </div>
  );
};

UserApproval.propTypes = {};

export default UserApproval;
