/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { bool } from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// services
import { userService, questionnaireService, authService } from '../../services';

// custom hooks
import { useFetchQuestions, useFetchUsers } from '../../hooks';

// components
import Spinner from '../../components/Spinner';
import { Question } from '../../components/Question';
import Submit from '../../components/DefaultSegments';
import ProgressIndicator from '../../components/ProgressIndicator';

// TODO: FIX BUG
// !BUG: When continuing questionnaire after logout, cannot move forward. Questionnaire stuck. Error loading resource.

const QuestionnairePresenter = ({
  questions,
  previousAnswers,
  previousPauses,
  questionsToSkip,
  isAdmin,
  iterationId
}) => {
  const { t } = useTranslation(['globals']);

  const history = useHistory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [pauses, setPauses] = useState(previousPauses);
  const [toSkip, setToSkip] = useState(questionsToSkip);
  const { userId } = useParams();
  const answersRef = useRef(answers);

  const willSkipQuestionAt = (index) => {
    if (questions && questions[index] && toSkip.includes(questions[index]._id)) {
      return true;
    }
    return false;
  };

  // Recursevly looking for the next Question that wont be skipped
  const nextUnskippedQuestionAt = (index) => {
    const newIndex = index;
    if (willSkipQuestionAt(index)) {
      return nextUnskippedQuestionAt(newIndex + 1);
    }

    return newIndex;
  };

  useEffect(() => {
    answersRef.current = answers;

    if (answers?.[0]?.questionId) {
      const nextQuestionIndex = nextUnskippedQuestionAt(currentIndex + 1);
      setCurrentIndex(nextQuestionIndex);
    }
  }, [answers]);

  useEffect(() => {
    if (!previousAnswers || !previousAnswers.length) {
      const initalAnswers = new Array(questions.length);
      setAnswers(initalAnswers);
    } else if (questions && questions.length) {
      const initalAnswers = new Array(questions.length).fill(null);
      previousAnswers.forEach((answer) => {
        const index = questions.findIndex((question) => {
          return question._id === answer.questionId;
        });
        if (index !== -1) {
          setCurrentIndex(() => nextUnskippedQuestionAt(index));
          initalAnswers[index] = answer;
        }
      });
      setAnswers(initalAnswers);
    }
  }, [questions]);

  useEffect(() => {
    if (currentIndex <= 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [currentIndex]);

  const prevUnskippedQuestionAt = (index) => {
    const newIndex = index;
    if (willSkipQuestionAt(index)) {
      return prevUnskippedQuestionAt(newIndex - 1);
    }
    return newIndex;
  };

  /*
  const addQuestionIdsSkip = (questionIds) => {
    setToSkip((state) => state.concat(questionIds));
  };

  const removeQuestionIdsFromSkip = (questionIds) => {
    setToSkip((state) => {
      return state.filter((prevAnswer) => !questionIds.includes(prevAnswer));
    });
  };

  const updateSkip = (prevAnswerOption, newAnswerOption) => {
    if (prevAnswerOption && prevAnswerOption.skip) {
      removeQuestionIdsFromSkip(prevAnswerOption.skip);
    }
    if (newAnswerOption && newAnswerOption.skip) {
      addQuestionIdsSkip(newAnswerOption.skip);
    }
  };
  */

  const flattenButtonArrays = (leftColumn, rightColumn) => {
    return [].concat(leftColumn, rightColumn);
  };

  const filterForButtonsContainingSkip = (buttons) => {
    return buttons.filter((button) => button?.skip?.length);
  };

  const filterForNewlySelectedButtons = (newUserInputs, previousUserInputs) => {
    return newUserInputs.filter((newInput) => {
      return !previousUserInputs.some((prevInput) => prevInput.id === newInput.id);
    });
  };

  const filterForDeselectedButtons = (newUserInputs, previousUserInputs) => {
    return previousUserInputs.filter((prevInput) => {
      return !newUserInputs.some((newInput) => prevInput.id === newInput.id);
    });
  };

  const removeQuestionIds = (questionIds, skip) => {
    const updatedToSkip = new Set([...skip]);

    questionIds.forEach((questionId) => {
      updatedToSkip.delete(questionId);
    });
    return updatedToSkip;
  };

  const addQuestionIds = (questionIds, skip) => {
    const updatedToSkip = new Set([...skip]);

    questionIds.forEach((questionId) => {
      updatedToSkip.add(questionId);
    });
    return updatedToSkip;
  };

  const updateToSkip = (previousUserInput, newUserInput, state) => {
    let updatedQuestionsToSkip = new Set([...state]);

    let filteredAndFlatNewUserInputs = [];
    let filteredAndFlatPreviousUserInputs = [];

    let newlySelectedButtons = [];
    let deselectedButtons = [];

    const questionIdsToRemove = new Set();
    const questionIdsToAdd = new Set();

    filteredAndFlatNewUserInputs = filterForButtonsContainingSkip(
      flattenButtonArrays(newUserInput.selectedButtonsLeft, newUserInput.selectedButtonsRight)
    );

    if (
      previousUserInput?.selectedButtonsLeft?.length ||
      previousUserInput?.selectedButtonsRight?.length
    ) {
      filteredAndFlatPreviousUserInputs = filterForButtonsContainingSkip(
        flattenButtonArrays(
          previousUserInput.selectedButtonsLeft,
          previousUserInput.selectedButtonsRight
        )
      );
    }

    deselectedButtons = filterForDeselectedButtons(
      filteredAndFlatNewUserInputs,
      filteredAndFlatPreviousUserInputs
    );

    newlySelectedButtons = filterForNewlySelectedButtons(
      filteredAndFlatNewUserInputs,
      filteredAndFlatPreviousUserInputs
    );

    deselectedButtons.forEach((button) => {
      button.skip.forEach((questionId) => {
        questionIdsToRemove.add(questionId);
      });
    });

    newlySelectedButtons.forEach((button) => {
      button.skip.forEach((questionId) => {
        questionIdsToAdd.add(questionId);
      });
    });

    updatedQuestionsToSkip = removeQuestionIds(questionIdsToRemove, updatedQuestionsToSkip);
    updatedQuestionsToSkip = addQuestionIds(questionIdsToAdd, updatedQuestionsToSkip);

    setToSkip([...updatedQuestionsToSkip]);
  };

  const handleSubmitAnswer = (answer) => {
    const { questionId, userInput } = answer;

    if (answersRef.current[currentIndex] && answersRef.current[currentIndex].userInput) {
      updateToSkip(answersRef.current[currentIndex].userInput, userInput, toSkip);
    } else {
      updateToSkip(null, userInput, toSkip);
    }

    setAnswers((prevState) => {
      const newState = [...prevState];
      newState[currentIndex] = { questionId, userInput };
      return newState;
    });
  };

  const handleOnPause = () => {
    if (pauses.indexOf(currentIndex) !== -1) {
      return;
    }
    userService.updateUserIteration(userId, iterationId, { pausedAt: [...pauses, currentIndex] });
    setPauses((prevState) => [...prevState, currentIndex]);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark questionnaire">
        {isAdmin ? (
          <div className="row no-gutters flex-row w-100 ">
            <div className="col d-flex justify-content-between my-2">
              <button
                type="button"
                className="btn btn-sm btn-light"
                disabled={isDisabled}
                onClick={() => {
                  const prevQuestionIndex = prevUnskippedQuestionAt(currentIndex - 1);
                  setCurrentIndex(prevQuestionIndex);
                }}
              >
                {t('globals:back', 'Zurück')}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning"
                onClick={() => {
                  userService
                    .updateUserData(userId, { iterations: [{ id: 0, answers: [] }] })
                    .then(() => {
                      setToSkip([]);
                      setAnswers([]);
                      setCurrentIndex(0);
                    });
                }}
              >
                {t('globals:reset_answers', 'Antworten zurücksetzen')}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning"
                onClick={() => {
                  history.push(`/users/${userId}`);
                }}
              >
                {t('globals:exit', 'Exit')}
              </button>
            </div>
            <div className="row no-gutters flex-row w-100">
              <div className="py-1" />
              <ProgressIndicator currentPosition={currentIndex} length={questions.length} />
            </div>
          </div>
        ) : (
          <div className="row no-gutters flex-row w-100">
            <div className="col d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn btn-light"
                disabled={isDisabled}
                onClick={() => {
                  const prevQuestionIndex = prevUnskippedQuestionAt(currentIndex - 1);
                  setCurrentIndex(prevQuestionIndex);
                }}
              >
                {t('globals:back', 'Zurück')}
              </button>
              <div className="pl-2" />
              <ProgressIndicator currentPosition={currentIndex} length={questions.length} />
              <div className="pl-2" />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => handleOnPause()}
                data-toggle="modal"
                data-target="#staticBackdrop"
              >
                {t('globals:pause', 'Pause')}
              </button>
            </div>
          </div>
        )}
      </nav>
      <div>
        {questions.length > 0 && (
          <>
            {currentIndex >= questions.length ? (
              <Submit iterationId={iterationId} />
            ) : (
              <>
                <div>
                  <Question
                    id={questions[currentIndex]._id}
                    title={questions[currentIndex].title}
                    subtitle1={questions[currentIndex].subtitle1}
                    subtitle2={questions[currentIndex].subtitle2}
                    help={questions[currentIndex].help}
                    previouslySubmittedAnswer={answers[currentIndex]}
                    answerOptions={questions[currentIndex].answerOptions}
                    onSubmitAnswer={(answer) => handleSubmitAnswer(answer)}
                    currentIndex={currentIndex}
                    iterationId={iterationId}
                    isImage={questions[currentIndex].answerOptions.type === 'images'}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Pause
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Alle antworten wurden gespeichert. Sie können sich jederzeit ausloggen und das
              Ausfüllen des Fragebogens zu einem späteren Zeitpunkt fortsetzen.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => authService.logoutUser()}
              >
                Ausloggen
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal">
                Umfrage Fortsetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionnairePresenterPage = ({ isAdmin }) => {
  const { t } = useTranslation(['globals']);

  const { userId, iterationId } = useParams();

  const [
    { fetchedQuestions, isLoadingQuestions, isErrorQuestions },
    setQuestionniareId
  ] = useFetchQuestions();
  const [{ users, isLoadingUsers, isErrorUsers }] = useFetchUsers(userId);
  const [iteration, setIteration] = useState();

  useEffect(() => {
    const fetchIds = async () => {
      await questionnaireService.getQuestionnaires({ fields: '_id' }).then((res) => {
        setQuestionniareId(res.data.questionnaires[0]._id);
      });
    };

    fetchIds();
  }, []);

  useEffect(() => {
    if (users?.length) {
      let answers = [];
      let questionsToSkip = [];
      let stoppedAtIndex = -1;
      let pausedAt = [];
      const status = users[0].iterations.filter(
        (prevIteration) => prevIteration.id === iterationId
      );
      if (status?.length) {
        answers = status[0].answers;
        questionsToSkip = status[0].questionsToSkip;
        stoppedAtIndex = status[0].stoppedAtIndex;
        pausedAt = status[0].pausedAt;
      }

      setIteration({ answers, questionsToSkip, stoppedAtIndex, pausedAt });
    }
  }, [users]);

  return (
    <div>
      {(isErrorUsers || isErrorQuestions) && (
        <div className="alert alert-danger d-flex justify-content-center mt-5" role="alert">
          {t(
            ('globals:error',
            'Etwas ist schiefgelaufen. Laden Sie die Seite erneut oder versuchen Sie es später noch einmal.')
          )}
        </div>
      )}
      {(isLoadingUsers || isLoadingQuestions) && (
        <div className="d-flex justify-content-center mt-5">
          <Spinner />
        </div>
      )}
      {users && users.length > 0 && fetchedQuestions && iteration && (
        <QuestionnairePresenter
          questions={fetchedQuestions}
          previousAnswers={iteration.answers}
          questionsToSkip={iteration.questionsToSkip}
          stoppedAtIndex={iteration.stoppedAtIndex + 1}
          previousPauses={iteration.pausedAt}
          isAdmin={isAdmin}
          iterationId={iterationId}
        />
      )}
      {!fetchedQuestions.length && (
        <div className="alert alert-warning d-flex justify-content-center mt-5" role="alert">
          {t('globals:questionnaire_empty', 'Der Fragebogen hat keine Fragen.')}
        </div>
      )}
    </div>
  );
};

QuestionnairePresenterPage.propTypes = {
  isAdmin: bool
};

QuestionnairePresenterPage.defaultProps = {
  isAdmin: false
};
export default QuestionnairePresenterPage;
