import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { change } from 'redux-form/immutable';

import first from 'lodash/first';
import replace from 'lodash/replace';
import last from 'lodash/last';
import indexOf from 'lodash/indexOf';

import { ExchangeIcon } from '../../../../Common/Icon/index.jsx';

import { getIndexFromName } from '../../../Common/helpers.js';

import styles from './styles.scss';

const SchedulePriority = ({ input: { onChange, value, ...input }, meta, isCurrentlyDragging, isDropTarget, ...props }) => {
  const currentIndex = getIndexFromName(input.name);

  const handleClick = step => () => {
    onChange(value + step);
    meta.dispatch(change(
      'hypertensionSettingsForm',
      `scheduleList[${props.sortedIndexes[indexOf(props.sortedIndexes, currentIndex) + step]}].schedulePriority`,
      value,
    ));
  };
  const dragClass = isCurrentlyDragging ? 'active-drag' : '';
  const dropClass = isDropTarget ? 'active-drop' : '';
  return (
    <div className={classNames(styles['schedule-priority'], dragClass, dropClass )}>
      <div className="icon-style">
        <ExchangeIcon 
        />
      </div>
    </div>
  );
};

SchedulePriority.propTypes = {

};

SchedulePriority.defaultProps = {

};

export default SchedulePriority;
