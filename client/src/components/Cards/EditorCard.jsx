/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { arrayOf, number, string, element, func } from 'prop-types';
import { nanoid } from 'nanoid';

import CardTabContents from './CardTabContents';
import CardNavTabs from './CardNavTabs';
import { DeleteButton } from '../Button';

const EditorCard = ({ index, tabNames, tabContents, removeCard }) => {
  const [selectedTab, setSelectedTab] = useState('');

  // When card renders for the first time, first tab is selected
  useEffect(() => {
    setSelectedTab(tabNames[0].toLowerCase());
  }, []);
  const cardId = nanoid();

  return (
    <div className="card">
      <div className="card-header">
        <div className="row no-gutters flex-row d-flex flex-nowrap justify-content-between mb-1">
          <div className="col d-flex p-0 mr-auto">{index}</div>
          <div className="col d-flex p-0 justify-content-end">
            <DeleteButton onClick={() => removeCard()} />
          </div>
        </div>
        <div className="no-gutters flex-row d-flex flex-nowrap">
          <div className="col">
            <CardNavTabs
              tabNames={tabNames}
              cardId={cardId}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>
        </div>
      </div>
      <div className="row no-gutters">
        <div className="col align-self-center">
          <div className="card-body px-2">
            <div className="tab-content" id="tab-content">
              <CardTabContents
                cardId={cardId}
                tabNames={tabNames}
                tabContents={tabContents}
                selectedTab={selectedTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EditorCard.propTypes = {
  index: number.isRequired,
  tabNames: arrayOf(string).isRequired,
  tabContents: arrayOf(element).isRequired,
  removeCard: func.isRequired
};

export default EditorCard;
