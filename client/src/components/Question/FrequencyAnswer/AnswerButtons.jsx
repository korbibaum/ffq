/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { arrayOf, shape, func, string, bool } from 'prop-types';

import AnswerButton from './AnswerButton';

const AnswerButtons = ({
  leftAnswerOptions,
  rightAnswerOptions,
  isMultipleChoice,
  previouslySubmittedAnswer,
  setUserInput,
  isPreview
}) => {
  const [hasUserInput, setHasUserInput] = useState(false);

  const [selectedButtonsLeft, setSelectedButtonsLeft] = useState([]);
  const [selectedButtonsRight, setSelectedButtonsRight] = useState([]);

  useEffect(() => {
    console.log('===============================');
    console.log('answer options changed:', leftAnswerOptions, rightAnswerOptions);
    console.log('previously submitted answer', previouslySubmittedAnswer);

    setSelectedButtonsLeft(
      leftAnswerOptions.map((answerOption) => {
        if (
          !previouslySubmittedAnswer ||
          !previouslySubmittedAnswer.userInput.selectedButtonsLeft
        ) {
          return false;
        }

        return previouslySubmittedAnswer.userInput.selectedButtonsLeft.includes(answerOption);
      })
    );
    setSelectedButtonsRight(
      rightAnswerOptions.map((answerOption) => {
        if (
          !previouslySubmittedAnswer ||
          !previouslySubmittedAnswer.userInput.selectedButtonsRight
        ) {
          return false;
        }
        return previouslySubmittedAnswer.userInput.selectedButtonsRight.includes(answerOption);
      })
    );
    setHasUserInput(false);
  }, [leftAnswerOptions, rightAnswerOptions]);

  const resetUserInput = () => {
    setSelectedButtonsLeft(leftAnswerOptions.map(() => false));
    setSelectedButtonsRight(rightAnswerOptions.map(() => false));
  };

  useEffect(() => {
    resetUserInput();
  }, [isMultipleChoice]);

  const updateSelectionLeft = (index) => {
    setSelectedButtonsLeft((prevSelection) => {
      const newSelection = [...prevSelection];
      newSelection[index] = !prevSelection[index];
      return newSelection;
    });
  };

  const updateSelectionRight = (index) => {
    setSelectedButtonsRight((prevSelection) => {
      const newSelection = [...prevSelection];
      newSelection[index] = !prevSelection[index];
      return newSelection;
    });
  };

  const handleButtonSelection = (position, index) => {
    setHasUserInput(true);

    if (!isMultipleChoice) {
      resetUserInput();
    }
    if (position === 'left') {
      updateSelectionLeft(index);
    } else {
      updateSelectionRight(index);
    }
  };

  const mapButtonsToAnswers = (selectedButtons, answerOptions) => {
    return answerOptions.filter((_, index) => {
      return selectedButtons[index];
    });
  };

  useEffect(() => {
    if (hasUserInput && !isMultipleChoice && !isPreview) {
      setUserInput({
        selectedButtonsLeft: mapButtonsToAnswers(selectedButtonsLeft, leftAnswerOptions),
        selectedButtonsRight: mapButtonsToAnswers(selectedButtonsRight, rightAnswerOptions)
      });
    }
  }, [hasUserInput]);

  return (
    <div>
      <div className="row mx-3">
        <div className="col-6">
          {selectedButtonsLeft &&
            leftAnswerOptions.map((answerOption, index) => (
              <div key={answerOption.id}>
                <AnswerButton
                  title={answerOption.title}
                  color={answerOption.color}
                  isSelectedAnswer={selectedButtonsLeft[index]}
                  onClick={() => handleButtonSelection('left', index)}
                />
              </div>
            ))}
        </div>
        <div className="col-6">
          {selectedButtonsRight &&
            rightAnswerOptions.map((answerOption, index) => (
              <div key={answerOption.id}>
                <AnswerButton
                  title={answerOption.title}
                  color={answerOption.color}
                  isSelectedAnswer={selectedButtonsRight[index]}
                  onClick={() => handleButtonSelection('right', index)}
                />
              </div>
            ))}
        </div>
      </div>
      {isMultipleChoice && (
        <div className="d-flex justify-content-center mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              if (!isPreview) {
                setUserInput({
                  selectedButtonsLeft: mapButtonsToAnswers(selectedButtonsLeft, leftAnswerOptions),
                  selectedButtonsRight: mapButtonsToAnswers(
                    selectedButtonsRight,
                    rightAnswerOptions
                  )
                });
                resetUserInput();
              }
            }}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
};

AnswerButtons.propTypes = {
  leftAnswerOptions: arrayOf(shape({ id: string.isRequired, title: string })).isRequired,
  rightAnswerOptions: arrayOf(shape({ id: string.isRequired, title: string })).isRequired,
  isMultipleChoice: bool.isRequired,
  previouslySubmittedAnswer: shape({
    questionId: string,
    createdAt: string,
    updatedAt: string,
    userInput: {
      selectedButtonsLeft: arrayOf(shape({ id: string, title: string })),
      selectedButtonsRight: arrayOf(shape({ id: string, title: string }))
    }
  }),
  setUserInput: func.isRequired,
  isPreview: bool.isRequired
};

AnswerButtons.defaultProps = {
  previouslySubmittedAnswer: {
    questionId: '',
    userInput: {
      selectedButtonsLeft: [],
      selectedButtonsRight: []
    }
  }
};

export default AnswerButtons;
