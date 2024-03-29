import React, { useState, useEffect } from 'react';
import { arrayOf, func, string, bool } from 'prop-types';
import { nanoid } from 'nanoid';

// localization
import { useTranslation } from 'react-i18next';

// components
import RemovableListItem from '../List';

// helpers
import { addValidString } from '../../helpers';

const RuleCriteriaSelect = ({ criteria, onChange }) => {
  return (
    <div className="form-group">
      <select
        multiple
        className="form-control"
        id="criteria"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {criteria.map((criterion) => {
          return <option key={criterion}>{criterion}</option>;
        })}
      </select>
    </div>
  );
};

RuleCriteriaSelect.propTypes = {
  criteria: arrayOf(string).isRequired,
  onChange: func.isRequired
};

const NewRuleCard = ({ criteria, removeCriteriaFromCard, onSubmit }) => {
  const { t } = useTranslation(['globals']);

  return (
    <>
      <form id="newRuleForm" onSubmit={(e) => onSubmit(e)}>
        <div className="card">
          <div className="card-header">{t('globals:new_rule', 'Neue Regel')}</div>
          <div className="card-body">
            <div className="row d-flex align-self-center justify-content-center">
              <div className="col flex-grow-1 mb-2">
                <ul className="list-group">
                  {criteria && criteria.length ? (
                    criteria.map((criterion) => (
                      <RemovableListItem
                        key={nanoid()}
                        content={criterion}
                        onClick={() => removeCriteriaFromCard(criterion)}
                        isTrashCan={false}
                      />
                    ))
                  ) : (
                    <div className="alert alert-light m-0" role="alert">
                      {t('globals:no_criteria_selected', 'Kein Kriterium ausgewählt.')}
                    </div>
                  )}
                </ul>
              </div>
              <div className="col d-flex align-self-center justify-content-center mr-1">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label className="btn btn-outline-primary active">
                    <input type="radio" name="option" id="and" autoComplete="off" defaultChecked />
                    {t('globals:and', 'Und')}
                  </label>
                  <label className="btn btn-outline-primary">
                    <input type="radio" name="option" id="or" autoComplete="off" />
                    {t('globals:or', 'Oder')}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="decisionSelect">
                  {t('globals:decision', 'Entscheidung')}{' '}
                </label>
              </div>
              <select className="custom-select" id="decisionSelect">
                <option value="Accept">{t('globals:accept', 'Akzeptieren')}</option>
                <option value="Reject">{t('globals:reject', 'Ablehnen')}</option>
                <option value="Wait">{t('globals:wait', 'Warten')}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

NewRuleCard.propTypes = {
  criteria: arrayOf(string).isRequired,
  removeCriteriaFromCard: func.isRequired,
  onSubmit: func.isRequired
};

const AddRuleButton = ({ disabled }) => {
  const { t } = useTranslation(['globals']);

  return (
    <button form="newRuleForm" className="btn btn-primary" type="submit" disabled={disabled}>
      {t('globals:add_rule', 'Regel hinzufügen')}
    </button>
  );
};

AddRuleButton.propTypes = {
  // onClick: func.isRequired,
  disabled: bool.isRequired
};

const AddRule = ({ selectionCriteria, saveRule }) => {
  const { t } = useTranslation(['globals']);

  const [canAddRule, setCanAddRule] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState([]);

  useEffect(() => {
    if (selectedCriteria.length) {
      setCanAddRule(true);
    } else {
      setCanAddRule(false);
    }
  }, [selectedCriteria]);

  const addCriteriaToCard = (criteria) => {
    addValidString(criteria, selectedCriteria, setSelectedCriteria);
  };

  const removeCriteriaFromCard = (criteriaToRemoveFromCard) => {
    setSelectedCriteria(
      selectedCriteria.filter((criteria) => criteria !== criteriaToRemoveFromCard)
    );
  };

  const submitNewRule = (e) => {
    e.preventDefault();

    let operator;
    if (selectedCriteria.length <= 1) {
      operator = '';
    } else if (e.target.and.checked) {
      operator = 'AND';
    } else if (e.target.or.checked) {
      operator = 'OR';
    }

    const newRule = {
      id: nanoid(),
      criteria: selectedCriteria,
      operator,
      decision: e.target.decisionSelect.value
    };

    saveRule(newRule);

    setSelectedCriteria([]);
  };

  return (
    <>
      <div className="col p-0 mb-3">
        <h6>{t('globals:selection_criteria', 'Auswahlkriterien')}</h6>
        <RuleCriteriaSelect criteria={selectionCriteria} onChange={addCriteriaToCard} />
        <NewRuleCard
          criteria={selectedCriteria}
          removeCriteriaFromCard={removeCriteriaFromCard}
          onSubmit={submitNewRule}
        />
      </div>
      <div className="row">
        <div className="col align-self-center d-flex justify-content-center">
          <AddRuleButton disabled={!canAddRule} />
        </div>
      </div>
    </>
  );
};

AddRule.propTypes = {
  selectionCriteria: arrayOf(string).isRequired,
  saveRule: func.isRequired
};

export default AddRule;
