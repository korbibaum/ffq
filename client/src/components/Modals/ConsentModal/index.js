import React from 'react';
import { func, string } from 'prop-types';

const ConsentModal = ({ consentScript, onAccept }) => {
  return (
    <div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Consent form
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">{consentScript}</div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={() => onAccept()}
              >
                I accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConsentModal.propTypes = {
  consentScript: string.isRequired,
  onAccept: func.isRequired
};

export default ConsentModal;
