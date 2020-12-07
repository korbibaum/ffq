/* eslint-disable no-unused-vars */
import React from 'react';
import { func, string } from 'prop-types';

const QuestionTypeSelection = () => {
  return (
    <div>
      <div className="input-group my-2">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="questionTypeSelect">
            Question Type
          </label>
        </div>
        <select className="custom-select" id="questionTypeSelect">
          <option defaultValue>Choose...</option>
          <option value="1">Type 1 (Buttons)</option>
          <option value="2">Type 2 (Pictures) </option>
          <option value="3">Type 3 (User Input)</option>
        </select>
      </div>
    </div>
  );
};

const TitleInputs = ({ type, onChange }) => {
  return (
    <div className="input-group my-2">
      <div className="input-group-prepend">
        <span className="input-group-text" id="jumbotron-titles-input">
          {type}
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        aria-label="title input"
        aria-describedby="jumbotron-titles-input"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

TitleInputs.propTypes = {
  type: string.isRequired,
  onChange: func.isRequired
};

function JumbotronInputs({ onChangeTitle, onChangeSubTitle, onChangeComment }) {
  return (
    <div>
      <div className="flex-column" id="inputs">
        <QuestionTypeSelection />
        <TitleInputs type="Title" onChange={onChangeTitle} />
        <TitleInputs type="Subtitle" onChange={onChangeSubTitle} />
        <TitleInputs type="Comment" onChange={onChangeComment} />
      </div>
    </div>
  );
}

JumbotronInputs.propTypes = {
  onChangeTitle: func.isRequired,
  onChangeSubTitle: func.isRequired,
  onChangeComment: func.isRequired
};

export default JumbotronInputs;