/* eslint-disable no-unused-vars */
import React from 'react';
import { func, string } from 'prop-types';

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

function JumbotronInputs({ onChangeTitle, onChangeSubtitle, onChangeComment }) {
  return (
    <div>
      <div className="flex-column" id="inputs">
        <TitleInputs type="Title" onChange={onChangeTitle} />
        <TitleInputs type="Subtitle 1" onChange={onChangeSubtitle} />
        <TitleInputs type="Subtitle 2" onChange={onChangeComment} />
      </div>
    </div>
  );
}

JumbotronInputs.propTypes = {
  onChangeTitle: func.isRequired,
  onChangeSubtitle: func.isRequired,
  onChangeComment: func.isRequired
};

export default JumbotronInputs;
