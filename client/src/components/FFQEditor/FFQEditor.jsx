/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import BootstrapTable from 'react-bootstrap-table-next';

import { DeleteButton } from '../Button';

import { questionService } from '../../services';

function FFQEditor(props) {
  const [questions, setQuestions] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('----------------------------------------------');
    const fetchData = async () => {
      const result = await questionService.fetchAllQuestions();
      setQuestions(result);
    };
    fetchData();
  }, []);

  const prepareRows = (questionData) => {
    const rows = questionData.map((question) => {
      return {
        _id: question._id,
        index: question.index,
        title: question.title,
        subtitle1: question.subtitle1,
        subtitle2: question.subtitle2,
        help: question.help,
        answerType: question.answerOptions.type
      };
    });
    return rows;
  };

  useEffect(() => {
    const rowData = prepareRows(questions);
    setData(rowData);
  }, [questions]);

  const deleteQuestion = async (_id) => {
    const response = await questionService.deleteQuestion(_id);

    const responseId = await response.data.data._id;
    setQuestions((state) => {
      const filteredQuestions = state.filter((question) => question._id !== responseId);
      return filteredQuestions;
    });
  };

  const columns = [
    {
      text: 'ID',
      dataField: '_id' // dataField is the "key" in the data
    },
    {
      text: 'Index',
      dataField: 'index'
    },
    {
      text: 'Title',
      dataField: 'title'
    },
    {
      text: 'Subtitle1',
      dataField: 'subtitle1'
    },
    {
      text: 'Subtitle2',
      dataField: 'subtitle2'
    },
    {
      text: 'Help',
      dataField: 'help'
    },
    {
      text: 'Type',
      dataField: 'answerType'
    },
    {
      text: 'Answer Options',
      dataField: 'answerOptions'
    }
  ];

  const deleteButton = (cell, row) => {
    return (
      <div className="d-flex justify-content-center">
        <DeleteButton isTrashCan onClick={() => deleteQuestion(row._id)} />
      </div>
    );
  };

  const enhancedColumns = [
    ...columns,
    {
      dataField: 'delete',
      text: 'Delete',
      editable: false,
      align: 'center',
      headerStyle: { width: 120 },
      formatter: deleteButton
    }
  ];

  return (
    <div>
      {/* <ul>
        {questions.map((item) => (
          <li key={item._id}>
            <div className="d-flex justify-content-start my-auto">
              {item._id} || {item.answerOptions.type} ||
              <DeleteButton isTrashCan onClick={() => deleteQuestion(item._id)} />
            </div>
          </li>
        ))}
      </ul> */}
      <div className="m-5">
        <div className="row no-gutters overflow-auto flex-row flex-nowrap my-3">
          <BootstrapTable keyField="_id" data={data} columns={enhancedColumns} />
        </div>
      </div>
    </div>
  );
}

FFQEditor.propTypes = {};

export default FFQEditor;