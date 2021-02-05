import React, { useState } from 'react';
import { func, string, arrayOf } from 'prop-types';

// icons
// eslint-disable-next-line no-unused-vars
import { InfoIcon, PlusIcon } from '@primer/octicons-react';

// services
import { questionnaireService } from '../../services';

// components
import RemovableListItem from '../List';
import Spinner from '../Spinner';

const SelectionCriteriaInput = ({ onClick }) => {
  const [newCriteriaInput, setNewCriteriaInput] = useState('');

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        name="newCriteria"
        id="newCriteria"
        className="form-control"
        value={newCriteriaInput}
        placeholder="Enter new criteria"
        onChange={(e) => setNewCriteriaInput(e.target.value)}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          type="button"
          onClick={() => {
            onClick(newCriteriaInput);
            setNewCriteriaInput('');
          }}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

SelectionCriteriaInput.propTypes = {
  onClick: func.isRequired
};

const SelectionCriteriaList = ({ selectionCriteria, onClick }) => {
  return (
    <ul className="w-100 list-group mb-3" style={{ minWidth: '15rem' }}>
      {selectionCriteria.map((criteria) => {
        return (
          <RemovableListItem
            key={criteria}
            content={criteria}
            onClick={() => onClick(criteria)}
            isTrashCan
          />
        );
      })}
    </ul>
  );
};

SelectionCriteriaList.propTypes = {
  selectionCriteria: arrayOf(string).isRequired,
  onClick: func.isRequired
};

const SelectionCriteria = ({
  questionnaireId,
  selectionCriteria,
  addSelectionCriteria,
  removeSelectionCriteria
}) => {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [didChange, setDidChange] = useState(false);

  return (
    <div className="d-flex justify-content-center">
      <div className="row no-gutters">
        <div className="col d-flex flex-wrap">
          <div className="m-0 mb-3 mb-sm-5">
            <button
              type="button"
              disabled={!didChange}
              className="btn btn-outline-primary mr-2"
              onClick={() => {
                questionnaireService
                  .updateQuestionnaire2(questionnaireId, { selectionCriteria })
                  .then(() => {
                    setStatus(
                      <div className="alert alert alert-success">Changes saved successfully.</div>
                    );
                    setSubmitting(false);
                    setDidChange(false);
                  })
                  .catch((error) => {
                    const errorList = (listElement) => (
                      <div className="alert alert-danger">
                        <ul className="list-unstyled content-align-center mb-0">{listElement}</ul>
                      </div>
                    );
                    const errorListElements = error.data.errors.map((err) => {
                      return <li key={err.value}>{err.msg}</li>;
                    });
                    setStatus(errorList(errorListElements));
                    setSubmitting(false);
                    setDidChange(false);
                  });
              }}
            >
              {submitting ? (
                <>
                  Saving...
                  <Spinner className="spinner-border spinner-border-sm ml-1" />
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
          <div className="m-0 mb-3">{status}</div>
        </div>

        {/* <p className="lead m-0 mb-3 mt-5">Selection Criteria</p> */}

        <SelectionCriteriaInput
          onClick={(criteria) => {
            setDidChange(true);
            setStatus('');
            addSelectionCriteria(criteria);
          }}
        />

        <SelectionCriteriaList
          selectionCriteria={selectionCriteria}
          onClick={(criteria) => {
            setDidChange(true);
            setStatus('');
            removeSelectionCriteria(criteria);
          }}
        />
      </div>
    </div>
  );
};

SelectionCriteria.propTypes = {
  questionnaireId: string.isRequired,
  selectionCriteria: arrayOf(string).isRequired,
  addSelectionCriteria: func.isRequired,
  removeSelectionCriteria: func.isRequired
};

export default SelectionCriteria;
