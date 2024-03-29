import React, { useState, useEffect } from 'react';
import { shape, arrayOf, string, bool, func } from 'prop-types';
import { get, findIndex, endsWith, trimEnd, differenceBy } from 'lodash';

const UserInputAnswer = ({ answerOptions, previouslySubmittedAnswer, setUserInput }) => {
  const [userInputs, setUserInputs] = useState(answerOptions);

  useEffect(() => {
    if (get(previouslySubmittedAnswer, ['answerOption', '0', 'answer'])) {
      const difference = differenceBy(previouslySubmittedAnswer.answerOption, answerOptions, 'id');
      const allInputFields = previouslySubmittedAnswer.answerOption.concat(difference);
      setUserInputs(allInputFields);
    }
  }, [previouslySubmittedAnswer]);

  useEffect(() => {
    setUserInputs(answerOptions);
  }, [answerOptions]);

  function updateAnswer(e) {
    const updatedUserInputs = [...userInputs];
    let index;
    let answeredInputField;
    if (endsWith(e.target.id, 'numberInput')) {
      const trimmed = trimEnd(e.target.id, '-numberInput');
      index = findIndex(userInputs, { id: trimmed });
      answeredInputField = userInputs[index];
      answeredInputField.numberAnswer = e.target.value;
    } else {
      index = findIndex(userInputs, { id: e.target.id });
      answeredInputField = userInputs[index];
      answeredInputField.answer = e.target.value;
    }
    updatedUserInputs.splice(index, 1, answeredInputField);
    setUserInputs(updatedUserInputs);
  }

  const submit = () => {
    if (!userInputs.length) {
      setUserInput([{ answer: '', hasNumberInput: false, id: 'null', title: '' }]);
    } else {
      setUserInput(userInputs);
    }
  };
  return (
    <div>
      {userInputs.map((userInput) => {
        return (
          <div key={userInput.id} className="my-4 mx-2 mx-md-4">
            <div className="row flex-row">
              <div className="col-auto flex-fill mb-2">
                <div className="input-group input-group-lg flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-lg">
                      {userInput.title}
                    </span>
                  </div>
                  <input
                    type="text"
                    id={userInput.id}
                    className="form-control"
                    aria-label="user input"
                    aria-describedby="inputGroup-sizing-lg"
                    placeholder={userInput.answer}
                    onChange={(e) => {
                      updateAnswer(e);
                    }}
                  />
                </div>
              </div>
              {userInput.hasNumberInput && (
                <div className="col" style={{ minWidth: '250px' }}>
                  <div className="input-group input-group-lg flex-nowrap">
                    <input
                      type="number"
                      id={`${userInput.id}-numberInput`}
                      min="0"
                      className="form-control"
                      placeholder={userInput.numberAnswer}
                      onChange={(e) => {
                        updateAnswer(e);
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroup-sizing-lg">
                        {userInput.numberInputTitle}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="d-flex justify-content-center mb-3">
        <button type="button" className="btn btn-outline-primary" onClick={() => submit()}>
          Weiter
        </button>
      </div>
    </div>
  );
};

UserInputAnswer.propTypes = {
  answerOptions: arrayOf(
    shape({
      id: string.isRequired,
      title: string,
      hasNumberInput: bool,
      numberInputTitle: string
    })
  ).isRequired,
  previouslySubmittedAnswer: shape({
    questionId: string,
    answerOption: arrayOf(shape({ id: string, title: string }))
  }),
  setUserInput: func.isRequired
};

UserInputAnswer.defaultProps = {
  previouslySubmittedAnswer: { questionId: '', answer: [{ id: '', value: '' }] }
};

export default UserInputAnswer;
