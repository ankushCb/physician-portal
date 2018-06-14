import React from 'react';
import { shape, string } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form/immutable';
import { DragSource, DropTarget } from 'react-dnd';

import isNull from 'lodash/isNull';

import ScheduleCardHeader from './ScheduleCardHeader.jsx';
import EachScheduleCard from './EachScheduleCard.jsx';

import Card from '../../../../Common/Presentational/MaterialCard';

import styles from './styles.scss';


const cardSource = {
  beginDrag(props) {
    return { id: props.id };
  },
  endDrag(props, monitor) {
    props.disableDrag();
  }
  
};

const cardTarget = {
  hover(props, monitor) {
    // console.log('dragging, ', monitor.getItem().id, props.id)
    props.dragging(monitor.getItem().id, props.id);
  },
  drop(props, monitor) {
    const draggedId = monitor.getItem().id;
    // console.log('dropped', draggedId, props.id);
    if (draggedId !== props.id) {
      props.moveCard(draggedId, props.id);
    }
    
  }
};

@DropTarget('card', cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
@DragSource('card', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

class MedicationScheduleItem extends React.Component {

  constructor(props) {
    super(props);

    this.renderCardHeader = this.renderCardHeader.bind(this);
  }

  renderCardHeader(hyperTensionMedName, isDroppingOnCurrentCard, isActive, idSorted) {
    return () => (
      <ScheduleCardHeader
        name={hyperTensionMedName}
        isDroppingOnCurrentCard={isDroppingOnCurrentCard}
        isActive={isActive}
        idSorted={idSorted}
        handleClickStatus={this.props.handleClickStatus}
      />
    )
  }
  render() {
    const {
      input: {
        value,
        name
      }
    } = this.props;
    const {
      dose,
      doseDetails,
      hyperTensionMedFrequency: freq,
      hyperTensionMedName,
    } = value.toJS();

    const { 
      text,
      isDragging,
      connectDragSource,
      connectDropTarget,
      isDropTarget,
      isCurrentlyDragging,
      isOver,
      scheduleData,
      idSorted,
      isActive,
    } = this.props;
    const { 
      isHavingMedication,
    } = doseDetails;
    const isPsuedoBid = (freq === 'qd' && !isNull(isHavingMedication) && isHavingMedication[0] && isHavingMedication[2]);
    const isDroppingOnCurrentCard = isDropTarget && isOver;
    const dropTargetClass = (isDropTarget && isOver) ? 'active-drop-target' : '';
    const dragSourceClass = isCurrentlyDragging ? 'active-drag-source' : '';
    return (
      connectDragSource(
        connectDropTarget(
          <div className={styles['dnd-wrapper']}>
            <Card
              TitleComponent={this.renderCardHeader(hyperTensionMedName, isDroppingOnCurrentCard, isActive, idSorted)}
              additionalClass={`schedule-modal ${dropTargetClass} ${dragSourceClass}`}
            >
              <div className="medication-schedule-item">
                {
                  isCurrentlyDragging ? (
                    <div className="dragged-message">
                      Drop this card there to alter the schedule priority
                    </div>
                  ) : (
                    <EachScheduleCard
                      itemName={name}
                      idSorted={idSorted}
                      isHavingMedication={isHavingMedication}
                      dose={dose}
                      hyperTensionMedName={hyperTensionMedName}
                      isPsuedoBid={isPsuedoBid}
                      freq={freq}
                    />
                  )
                }
              </div>
            </Card>
          </div>
        )
      )
    );
  }
}

MedicationScheduleItem.propTypes = {
  input: shape({
    name: string.isRequired,
  }).isRequired,
};

export default MedicationScheduleItem;
