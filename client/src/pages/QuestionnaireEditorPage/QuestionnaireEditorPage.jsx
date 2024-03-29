/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

// localization
import { useTranslation } from 'react-i18next';

// services
import { questionnaireService } from '../../services';

// custom hooks
import { useFetchQuestionnaires, useFetchQuestions } from '../../hooks';

// components
import Spinner from '../../components/Spinner';
import { NavTabs, NavContents } from '../../components/Navigation';
import QuestionEditor from '../../components/QuestionEditor';
import { OutlineButton } from '../../components/Button';
import QuestionnaireSettings from '../../components/Settings';
import QuestionTable from './QuestionTable';

const QuestionnaireEditor = ({ questionnaire, deleteQuestionnaire }) => {
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
  const { t } = useTranslation(['globals']);

  const [
    { fetchedQuestions, isLoadingQuestions, isErrorQuestions },
    setQuestionniareId
  ] = useFetchQuestions(questionnaire._id);

  const [questions, setQuestions] = useState([]);
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [saveState, setSaveState] = useState();

  const questionsRef = useRef(questions);

  useEffect(() => {
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  useEffect(() => {
    if (selectedQuestion) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [selectedQuestion]);

  const prepareRows = (questionData) => {
    const rows = questionData.map((question, index) => {
      return {
        question,
        index
      };
    });
    return rows;
  };

  useEffect(() => {
    if (questions) {
      questionsRef.current = questions;
      if (isEditing) {
        return;
      }
      const rowData = prepareRows(questions);
      setData(rowData);
    }
  }, [questions, isEditing]);

  const saveSettings = async (settings) => {
    await questionnaireService
      .updateQuestionnaire(questionnaire._id, settings)
      .then(() => {
        setSaveState(
          <div className="alert alert alert-success">
            {t('globals:changes_save_success', 'Änderungen erfolgreich gespeichert.')}
          </div>
        );
      })
      .catch((err) => {
        <div className="alert alert alert-danger">
          {t('globals:changes_save_error', 'Änderungen konnent nicht gespeichert werden.')}
        </div>;
      });
  };

  const modalTableColumns = [
    {
      text: '',
      dataField: 'index',
      align: 'center',
      style: { width: '8px' }
    },
    {
      text: t('globals:title', 'Titel'),
      dataField: 'question.title'
    },
    {
      text: t('globals:subtitle1', 'Untertitel 1'),
      dataField: 'question.subtitle1'
    },
    {
      text: t('globals:subtitle2', 'Untertitel 2'),
      dataField: 'question.subtitle2'
    }
  ];

  const updateQuestions = (editedQuestion) => {
    const questionsCopy = questionsRef.current;
    questionsCopy.splice(selectedQuestion.index, 1, editedQuestion);
    setQuestions(questionsCopy);
    setIsEditing(false);
  };

  const questionsContent = (
    <div>
      {isEditing ? (
        <QuestionEditor
          question={selectedQuestion.question}
          onExit={updateQuestions}
          modalTable={{ data, modalTableColumns, index: selectedQuestion.index }}
        />
      ) : (
        <div>
          <div>
            {isErrorQuestions && (
              <div className="alert alert-danger d-flex justify-content-center mt-5" role="alert">
                {t(
                  ('globals:error',
                  'Etwas ist schiefgelaufen. Laden Sie die Seite erneut oder versuchen Sie es später noch einmal.')
                )}
              </div>
            )}
            {isLoadingQuestions ? (
              <div className="d-flex justify-content-center mt-5">
                <Spinner />
              </div>
            ) : (
              <div className="row no-gutters overflow-auto flex-row flex-nowrap my-4">
                <QuestionTable
                  data={data}
                  setSelectedQuestion={setSelectedQuestion}
                  setQuestions={setQuestions}
                  questionnaire={questionnaire}
                  questionsRef={questionsRef}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const settingsContent = (
    <QuestionnaireSettings
      questionnaire={questionnaire}
      save={saveSettings}
      saveState={saveState}
      setSaveState={setSaveState}
    />
  );

  const tabNames = [
    t('globals:questions_tab', 'Fragen'),
    t('globals:settings_tab', 'Einstellungen')
  ];
  const tabContents = [questionsContent, settingsContent];

  return (
    <div>
      <div>
        <NavTabs tabNames={tabNames} />
      </div>
      <div>
        <NavContents tabNames={tabNames} tabContents={tabContents} />
      </div>
    </div>
  );
};

const QuestionnaireEditorPage = () => {
  const { t } = useTranslation(['globals']);

  const [
    { fetchedQuestionnaires, isLoadingQuestionnaires, isErrorQuestionnaires }
  ] = useFetchQuestionnaires();

  const [questionnaires, setQuestionnaires] = useState();

  useEffect(() => {
    if (fetchedQuestionnaires) {
      setQuestionnaires(fetchedQuestionnaires);
    }
  }, [fetchedQuestionnaires]);

  const handleCreateQuestionnaire = async () => {
    await questionnaireService.createQuestionnaire().then((res) => {
      setQuestionnaires((state) => [...state, res.data.questionnaire]);
    });
  };

  const handleDeleteQuestionnaire = async (id) => {
    const deletedQuestionnaire = await questionnaireService.deleteQuestionnaire(id);
    setQuestionnaires(
      questionnaires.filter((questionnaire) => questionnaire._id !== deletedQuestionnaire._id)
    );
  };

  return (
    <div>
      {!questionnaires || !questionnaires.length ? (
        <div>
          {isErrorQuestionnaires && (
            <div className="alert alert-danger d-flex justify-content-center mt-5" role="alert">
              {t(
                ('globals:error',
                'Etwas ist schiefgelaufen. Laden Sie die Seite erneut oder versuchen Sie es später noch einmal.')
              )}
            </div>
          )}
          {isLoadingQuestionnaires ? (
            <div className="d-flex justify-content-center mt-5">
              <Spinner />
            </div>
          ) : (
            <div className="my-5 d-flex justify-content-center">
              <OutlineButton
                title="Create Questionnaire"
                onClick={() => handleCreateQuestionnaire()}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="m-2 m-sm-4">
          {questionnaires.map((questionnaire) => {
            return (
              <div key={questionnaire._id} className="my-3">
                <div className="">
                  <QuestionnaireEditor
                    questionnaire={questionnaire}
                    deleteQuestionnaire={() => handleDeleteQuestionnaire}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireEditorPage;
