import { nanoid } from 'nanoid';
import {
  insertQuestionAt,
  getAllQuestionsOfQuestionnaire,
  insertQuestionnaire,
  getAllQuestionnaires,
  getQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaireById,
  deleteQuestionById
} from '../api';

const updateAction = {
  insert: 'insert',
  insertAt: 'insertAt',
  removeById: 'removeById',
  move: 'move',
  changeSettings: 'changeSettings'
};

const createQuestionnaire = async () => {
  const payload = {
    _id: nanoid()
  };

  return insertQuestionnaire(payload).then((res) => {
    return res.data;
  });
};

const fetchAllQuestionnaires = async () => {
  return getAllQuestionnaires().then((questionnaires) => {
    return questionnaires.data.data;
  });
};

const fetchQuestionnaires = async (param) => {
  return getQuestionnaires({ param }).then((response) => {
    return response.data;
  });
};

const fetchAllQuestionsOfQuestionnaire = async (questionnaireId) => {
  if (!questionnaireId) {
    return [];
  }
  return getAllQuestionsOfQuestionnaire(questionnaireId).then((response) => {
    return response.data.data;
  });
};

const createQuestionAt = async (questionnaireId, index) => {
  const questionId = nanoid();

  const questionPayload = {
    _id: questionId,
    title: `New Question`,
    subtitle1: '',
    subtitle2: '',
    help: '',
    answerOptions: {
      type: '',
      options: []
    }
  };

  return insertQuestionAt(questionnaireId, questionPayload).then(async (question) => {
    const questionnairePayload = {
      action: updateAction.insert,
      questionId: question.data.id
    };
    if (index >= 0) {
      questionnairePayload.action = updateAction.insertAt;
      questionnairePayload.index = index;
    }
    return updateQuestionnaire(questionnaireId, questionnairePayload).then((res) => {
      return res.data;
    });
  });
};

const removeQuestionById = (questionnaireId, questionId) => {
  return deleteQuestionById(questionnaireId, questionId).then(() => {
    const questionnairePayload = {
      action: updateAction.removeById,
      questionId
    };
    return updateQuestionnaire(questionnaireId, questionnairePayload).then((res) => {
      return res.data;
    });
  });
};

const moveQuestionFromTo = async (questionnaireId, questionId, fromIndex, toIndex) => {
  const questionnairePayload = {
    action: updateAction.move,
    questionId,
    fromIndex,
    toIndex
  };
  return updateQuestionnaire(questionnaireId, questionnairePayload).then((res) => {
    return res.data;
  });
};

const updateQuestionnaireSettings = (questionnaireId, settings) => {
  const questionnairePayload = {
    action: updateAction.changeSettings,
    settings
  };
  return updateQuestionnaire(questionnaireId, questionnairePayload).then((res) => {
    return res.data;
  });
};

const deleteQuestionnaire = async (id) => {
  const deletedQuestionnaire = await deleteQuestionnaireById(id);
  return deletedQuestionnaire.data.data;
};
const questionnaireService = {
  createQuestionnaire,
  fetchAllQuestionnaires,
  fetchQuestionnaires,
  fetchAllQuestionsOfQuestionnaire,
  createQuestionAt,
  moveQuestionFromTo,
  updateQuestionnaireSettings,
  removeQuestionById,
  deleteQuestionnaire
};

export default questionnaireService;
