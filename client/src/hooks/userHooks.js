import { useEffect, useState, useReducer } from 'react';

// services
import { userService } from '../services';

// custom users fetching hook
const useFetchUsers = (userId, iterationId, initialFields) => {
  const [fields, setFields] = useState(initialFields);

  const fetchUserReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoadingUsers: true,
          isErrorUsers: false
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoadingUsers: false,
          isErrorUsers: false,
          users: action.payload
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoadingUsers: false,
          isErrorUsers: true
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(fetchUserReducer, {
    users: [],
    isLoadingUsers: false,
    isErrorUsers: false
  });

  useEffect(() => {
    let didCancel = false;

    const fetchUsers = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const fetchedUsers = await userService.fetchUsers(userId, iterationId, fields);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: fetchedUsers });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchUsers();
    return () => {
      didCancel = true;
    };
  }, [fields]);

  return [state, setFields];
};

// Update user data
const useUpdateUser = (userId) => {
  const [update, setUpdate] = useState();

  const updateUserReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_INIT':
        return {
          ...state,
          isUpdatingUser: true,
          errorUpdatingUser: false
        };
      case 'UPDATE_SUCCESS':
        return {
          ...state,
          isUpdatingUser: false,
          errorUpdatingUser: false,
          update: action.payload
        };
      case 'UPDATE_FAILURE':
        return {
          ...state,
          isUpdatingUser: false,
          errorUpdatingUser: true
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(updateUserReducer, {
    update: {},
    isUpdatingUser: false,
    errorUpdatingUser: false
  });

  useEffect(() => {
    let didCancel = false;
    const fetchQuestions = async () => {
      dispatch({ type: 'UPDATE_INIT' });
      try {
        if (userId && update) {
          await userService.updateUserData(userId, update).then(() => {
            if (!didCancel) {
              dispatch({ type: 'UPDATE_SUCCESS', payload: update });
            }
          });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'UPDATE_FAILURE' });
        }
      }
    };
    fetchQuestions();
    return () => {
      didCancel = true;
    };
  }, [update]);

  return [state, setUpdate];
};

// Custom answer saving hook
const useSaveAnswer = (userId, iterationId, questionId, answerType) => {
  const [userInput, setUserInput] = useState();

  const saveAnswerReducer = (state, action) => {
    switch (action.type) {
      case 'SAVE_INIT':
        return {
          ...state,
          isSavingAnswer: true,
          errorSavingAnswer: false
        };
      case 'SAVE_SUCCESS':
        return {
          ...state,
          isSavingAnswer: false,
          errorSavingAnswer: false,
          userInput: action.payload
        };
      case 'SAVE_FAILURE':
        return {
          ...state,
          isSavingAnswer: false,
          errorSavingAnswer: true
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(saveAnswerReducer, {
    userInput: null,
    isSavingAnswer: false,
    errorSavingAnswer: false
  });

  useEffect(() => {
    let didCancel = false;
    if (!userInput) {
      return () => {
        didCancel = true;
      };
    }
    const saveAnswer = async () => {
      dispatch({ type: 'SAVE_INIT' });
      try {
        const answer = {
          questionId,
          type: answerType,
          userInput
        };
        await userService
          .updateUserIterationAnswer(userId, iterationId, questionId, answer)
          .then(() => {
            if (!didCancel) {
              dispatch({
                type: 'SAVE_SUCCESS',
                payload: answer
              });
            }
          });
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'SAVE_FAILURE' });
        }
      }
    };
    saveAnswer();
    return () => {
      didCancel = true;
    };
  }, [userInput]);

  return [state, setUserInput];
};

export { useFetchUsers, useUpdateUser, useSaveAnswer };
