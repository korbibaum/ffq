import React, { useState } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';

// components
import DateIntervalSettings from '../DateInterval';

const QuestionnaireSettings = ({ questionnaire, save }) => {
  const [name, setName] = useState(questionnaire.name);
  const [consentScript, setConsentScript] = useState(questionnaire.consentScript);
  const [iterations, setIterations] = useState(questionnaire.iterations);

  return (
    <div>
      <div className="row no-gutters mt-4">
        <div className="col col-md-8 col-lg-6 col-xl-5">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              save({ name, consentScript, iterations });
            }}
          >
            Save Settings
          </button>
          <p className="lead m-0 mb-1 mt-5">Questionnaire Name</p>
          <hr className="m-0 mb-3" />
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby="inputGroup-name"
          />

          <p className="lead m-0 mb-1 mt-5">Access Intervals</p>
          <hr className="m-0 mb-3" />
          <div className="col d-flex p-0">
            <DateIntervalSettings iterations={iterations} setIterations={setIterations} />
          </div>
          <p className="lead m-0 mb-1 mt-5">Consent Script</p>
          <hr className="m-0 mb-3" />
          <textarea
            className="form-control"
            id="consentText"
            rows="6"
            value={consentScript}
            onChange={(e) => setConsentScript(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

QuestionnaireSettings.propTypes = {
  questionnaire: shape({
    id: string,
    name: string,
    consentScript: string,
    iterations: arrayOf(
      shape({
        id: string,
        start: string,
        end: string
      })
    )
  }).isRequired,
  save: func.isRequired
};

export default QuestionnaireSettings;
