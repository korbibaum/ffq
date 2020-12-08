import React, { useEffect } from 'react';
import { string } from 'prop-types';
import $ from 'jquery';
import { QuestionIcon } from '@primer/octicons-react';

const Help = ({ infoText }) => {
  useEffect(() => {
    $('[data-toggle="popover"]').popover();
  }, []);

  return (
    <div className="text-info mx-4">
      <button
        type="button"
        className="btn text-info p-0"
        data-container="body"
        data-toggle="popover"
        data-placement="bottom"
        data-content={infoText}
      >
        <QuestionIcon size="40" />
      </button>
    </div>
  );
};

Help.propTypes = {
  infoText: string.isRequired
};

export default Help;