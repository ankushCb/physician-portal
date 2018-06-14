import React from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import { Row, Col } from 'react-flexbox-grid';
import { FieldArray, Field, formValueSelector, blur, change } from 'redux-form/immutable';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';

import MessageContainer from 'scripts/modules/Common/Presentational/List.jsx';

import MedicationScheduleItem from './MedicationScheduleItem.jsx';

import styles from './styles.scss';

@DragDropContext(HTML5Backend)
class MedicationScheduleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnyCardDragging: false,
      dragSourceId: null,
      dragDropId: null,
    };

    this.moveCard = this.moveCard.bind(this);
    this.dragging = this.dragging.bind(this);
    this.disableDrag = this.disableDrag.bind(this);
    this.handleClickCard = this.handleClickCard.bind(this);
    this.changeIsActive = this.changeIsActive.bind(this);
    this.handleClickStatus = this.handleClickStatus.bind(this);
  }

  disableDrag() {
    this.setState({
      isAnyCardDragging: false,
      dragSourceId: null,
      dragDropId: null,
    });
  }

  moveCard(id, afterId) {
    const scheduleList = this.props.scheduleList;
    const updatedData = scheduleList
      .toSeq()
      .reduce((accumulator, data) => {
        const schedulePriority = data.get('schedulePriority');
        if (schedulePriority === id) {
          data = data.set('schedulePriority', afterId);
        } else if (id < afterId) {
          if(schedulePriority <= afterId && schedulePriority > id) {
            data = data.set('schedulePriority', schedulePriority - 1);
          }
        } else if (id > afterId) {
          if(schedulePriority >= afterId && schedulePriority < id) {
            data = data.set('schedulePriority', schedulePriority + 1);
          }
        }
        return accumulator.push(data);
      }, List())
      .toList();
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'FORM_DRAG_START',
    });
    forEach(updatedData.toJS(), (value, field) => {
      dispatch(change('hypertensionSettingsForm', `scheduleList.${field}`, fromJS(value)));
    });
    dispatch({
      type: 'FORM_DRAG_END',
    });

  }

  dragging(id, afterId) {
    if (!this.state.isAnyCardDragging || !(this.state.dragSourceId === id && this.dragDropId === afterId)) {
      this.setState({
        isAnyCardDragging: true,
        dragSourceId: id,
        dragDropId: afterId,
      });
    }
  }
  
  changeIsActive(id, isActive) {
    const scheduleList = this.props.scheduleList;
    let scheduleListItem = scheduleList.get(id);
    console.log('scheduleItem ', scheduleListItem);
    scheduleListItem = scheduleListItem.set('isActive', isActive);
    scheduleListItem = scheduleListItem.set('dose', isActive ? '1' : '0');
    const {
      dispatch,
    } = this.props;

    dispatch(change('hypertensionSettingsForm', `scheduleList.${id}`, scheduleListItem));
  }

  handleClickCard(clickedId, isActive) {
    return () => {
      if (!isActive) {
        this.changeIsActive(clickedId, true);
      }
    }
  }

  handleClickStatus(clickedId, isActive) {
    return () => {
      console.log('clicked ', clickedId, isActive);
      this.changeIsActive(clickedId, !isActive);
    }
  }

  render() {
    const {
      scheduleList,
      mealTimings,
    } = this.props;
    
    const isItCurrentlyDragging = (index, dragSourceId, dragDropId) => ((index === dragSourceId) && (dragSourceId !== dragDropId));
    const isCurrentlyDropped = (index, dragSourceId, dragDropId) => ((index === dragDropId) && (dragSourceId !== dragDropId));
    // console.log('drag and drop ', this.state.dragSourceId, this.state.dragDropId);
    if (scheduleList) {
      const sortedList = sortBy(filter(scheduleList.toArray(), item => (item.get('isInSchedule') && !isNil(item.get('hyperTensionMedName')))), item => item.get('schedulePriority'));
      const sortedIndexes = map(sortedList, item => scheduleList.findIndex(schdItm => schdItm.get('hyperTensionMedClass') === item.get('hyperTensionMedClass')))
      return (
        <div className={styles['medication-schedule-item']}>
          {
            sortedList.length === 0 ? (
              <MessageContainer
                noItemMessage="No Schedule Data"
              />
            ) : (
              <Row>
                {
                  map(sortBy(sortedList, (item, index) => item.get('schedulePriority')), (scheduleListItem, index) => (
                    <Col key={sortedIndexes[index]} xs={6} sm={6} md={3} lg={3}>
                      <Field
                        name={`scheduleList[${sortedIndexes[index]}]`}
                        component={MedicationScheduleItem}
                        sortedIndexes={sortedIndexes}
                        id={index}
                        idSorted={sortedIndexes[index]}
                        moveCard={this.moveCard}
                        dragging={this.dragging}
                        isCurrentlyDragging={isItCurrentlyDragging(index, this.state.dragSourceId, this.state.dragDropId)}
                        isDropTarget={isCurrentlyDropped(index, this.state.dragSourceId, this.state.dragDropId)}
                        disableDrag={this.disableDrag}
                        isActive={scheduleListItem.get('isActive')}
                        handleClickCard={this.handleClickCard}
                        handleClickStatus={this.handleClickStatus}
                      />
                    </Col>
                  ))
                }
              </Row>
            )
          }
        </div>
      );
    } else {
      return (
        <div>
          Schedule list
        </div>
      )
    }
  }
}

export default MedicationScheduleList;
