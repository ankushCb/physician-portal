import React from 'react';
import styles from './styles.scss';

const ScheduleCardHeader = ({ 
  name,
  isDroppingOnCurrentCard,
  handleClickStatus,
  idSorted,
  isActive,
}) => (
  <div className="card-header">
    <span className="name"> {name} </span>
    <span
      className={`highlighter ${isActive ? 'active' : 'not-active'}` }
      onClick={handleClickStatus(idSorted, isActive)}
    />
  </div>
);

export default ScheduleCardHeader;