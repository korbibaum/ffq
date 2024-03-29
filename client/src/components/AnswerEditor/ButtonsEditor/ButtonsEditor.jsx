import React from 'react';
import { arrayOf, func, string, shape, number } from 'prop-types';
import { nanoid } from 'nanoid';

// localization
import { useTranslation } from 'react-i18next';

import { OutlineButton } from '../../Button';
import ButtonEditor from './ButtonEditor';
import { CardsGrid } from '../../Cards';

const ButtonColumn = ({ answerOptions, position, dispatch, modalTable }) => {
  const { t } = useTranslation(['globals']);

  const translatePosition = () => {
    switch (position.toLowerCase()) {
      case 'left':
        return t('globals:left', 'links');
      case 'right':
        return t('globals:rechts', 'rechts');
      default:
        return '';
    }
  };

  const ButtonEditors = answerOptions.map((answerOption, index) => {
    return (
      <ButtonEditor
        key={answerOption.id}
        index={index + 1}
        answerOption={answerOption}
        dispatch={dispatch}
        position={position}
        modalTable={modalTable}
      />
    );
  });

  return (
    <div className="text-center">
      {answerOptions.length > 0 && (
        <span className="badge badge-secondary">{translatePosition(position)}</span>
      )}
      <CardsGrid Cards={ButtonEditors} gridColumns="row-cols-1" />
    </div>
  );
};

ButtonColumn.propTypes = {
  answerOptions: arrayOf(shape({ id: string.isRequired, title: string })),
  position: string.isRequired,
  dispatch: func.isRequired,
  modalTable: shape({ data: shape({}), modalTableColumns: shape({}), index: number }).isRequired
};
ButtonColumn.defaultProps = {
  answerOptions: []
};

const AddButton = ({ position, dispatch }) => {
  const { t } = useTranslation(['globals']);

  const translatePosition = () => {
    switch (position.toLowerCase()) {
      case 'left':
        return t('globals:add_button_left', 'Button links hinzufügen');
      case 'right':
        return t('globals:add_button_rechts', 'Button rechts hinzufügen');
      default:
        return '';
    }
  };

  return (
    <div>
      <OutlineButton
        title={translatePosition(position)}
        onClick={() =>
          dispatch({
            type: 'addButton',
            payload: { id: nanoid(), title: '', position }
          })
        }
      />
    </div>
  );
};

AddButton.propTypes = { position: string.isRequired, dispatch: func.isRequired };

const ButtonsEditor = ({ answerOptions, dispatch, modalTable }) => {
  const removeButton = (buttonToRemove, position) => {
    dispatch({ type: 'removeButton', payload: { position, id: buttonToRemove.id } });
  };

  const handleIsMultipleChoiceInputChange = (event) => {
    const { checked } = event.target;
    dispatch({ type: 'setMultipleChoice', payload: { isMultipleChoice: checked } });
  };

  return (
    <div className="row no-gutters my-5">
      <div className="col-lg-12 col-md text-center">
        <div className="row no-gutters">
          <div className="col pr-1">
            <AddButton position="left" dispatch={dispatch} />
          </div>
          <div className="col pl-1">
            <AddButton position="right" dispatch={dispatch} />
          </div>
        </div>
        <div className="row no-gutters mt-3 mx-auto">
          <div className="col">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={handleIsMultipleChoiceInputChange}
              checked={answerOptions.isMultipleChoice}
              id="multipleChoice"
            />
            <label className="form-check-label" htmlFor="multipleChoice">
              Multiple choice
            </label>
          </div>
        </div>
        <div className="row no-gutters row-cols-1 row-cols-sm-2">
          {answerOptions.options.left && (
            <div className="col pr-sm-2 pr-0">
              <ButtonColumn
                answerOptions={answerOptions.options.left}
                position="left"
                dispatch={dispatch}
                removeButton={removeButton}
                modalTable={modalTable}
              />
            </div>
          )}
          {answerOptions.options.right && (
            <div className="col pl-sm-2 pl-0">
              <ButtonColumn
                answerOptions={answerOptions.options.right}
                position="right"
                dispatch={dispatch}
                removeButton={removeButton}
                modalTable={modalTable}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ButtonsEditor.propTypes = {
  answerOptions: shape({
    left: arrayOf(shape({ id: string.isRequired, title: string })),
    right: arrayOf(shape({ id: string.isRequired, title: string }))
  }).isRequired,
  dispatch: func.isRequired,
  modalTable: shape({ data: shape({}), modalTableColumns: shape({}), index: number }).isRequired
};

export default ButtonsEditor;
