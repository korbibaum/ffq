import React, { useState } from 'react';
import { string, func, shape, number, bool } from 'prop-types';

import { XIcon } from '@primer/octicons-react';
import TextEditor from '../../TextEditor';

import { EditorCard } from '../../Cards';

const ImageUpload = ({ onChange, answerId, disabled }) => {
  const [imageUploadLabel, setImageUploadLabel] = useState('Select Image');

  return (
    <div>
      <div className="input-group input-group-sm">
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={disabled}
            onClick={() => {
              setImageUploadLabel('Select Image');
              onChange({
                type: 'removeCardImage',
                payload: { id: answerId }
              });
            }}
          >
            <XIcon />
          </button>
        </div>

        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="imageUpload"
            aria-describedby="imageUploadAddon"
            onChange={(e) => {
              setImageUploadLabel(e.target.files[0].name);
              onChange({
                type: 'changeCardImage',
                payload: {
                  id: answerId,
                  imageData: e.target.files[0],
                  imageURL: URL.createObjectURL(e.target.files[0])
                }
              });
            }}
          />
          <label
            className="custom-file-label"
            htmlFor="imageUpload"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {imageUploadLabel}
          </label>
        </div>
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onChange: func.isRequired,
  answerId: string.isRequired,
  disabled: bool.isRequired
};

const CardEditor = ({ id, answerOption, dispatch }) => {
  const tabNames = ['Text', 'Image'];

  const textTabContent = (
    <TextEditor
      placeholder="Card Title"
      onChange={(value) => {
        dispatch({
          type: 'changeCardTitle',
          payload: { id: answerOption.id, title: value }
        });
      }}
    />
  );

  const imageTabContent = (
    <ImageUpload
      answerId={answerOption.id}
      onChange={dispatch}
      disabled={answerOption.imageURL === ''}
    />
  );

  const removeCard = () => {
    dispatch({
      type: 'removeCard',
      payload: { id: answerOption.id }
    });
  };

  return (
    <div className="col my-3">
      <EditorCard
        index={id}
        tabNames={tabNames}
        tabContents={[textTabContent, imageTabContent]}
        removeCard={removeCard}
      />
    </div>
  );
};

CardEditor.propTypes = {
  id: number.isRequired,
  answerOption: shape({
    id: string.isRequired,
    title: string,
    imageName: string
  }).isRequired,
  dispatch: func.isRequired
};

export default CardEditor;