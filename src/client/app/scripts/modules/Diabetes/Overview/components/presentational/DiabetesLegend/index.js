import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import map from 'lodash/map';
import ColoredBg from '../../../../../Common/Presentational/ColoredBg.jsx';
import styles from './styles.scss';

const legendData = [
  {
    value1: '260',
    type1: 'gt-hyper',
    content1: `you're really off`,
    value2: 'NA',
    type2: 'normal',
    content2: 'Value was not expected here',
  },
  {
    value1: '220',
    type1: 'gt-goal',
    content1: `you're at goal`,
    value2: 'X',
    type2: 'normal',
    content2: 'Value was expected but never entered',
  },
  {
    value1: '130',
    type1: 'normal',
    content1: `You are at goal`,
  },
  {
    value1: '40',
    type1: 'lt-hypo',
    content1: `Danger what happened`,
  }
]
const renderEachLegend = (legendData) => {
  return map(legendData, ({ value1, type1, content1, value2, type2, content2 }) => {
    return (
      <Row key={value1} className="each-row">
        <Col xs={1}>
          <ColoredBg
            type={type1}
            value={value1}
          />
        </Col>
        <Col xs={4}>
          {content1}
        </Col>
        <Col xsOffset={1} xs={1}>
          <ColoredBg
            type={type2}
            value={value2}
          />
        </Col>
        <Col xs={4}>
          {content2}
        </Col>
      </Row>
    );
  });
};

const DiabetesLegend = () => (
  <div className={styles['diabetes-legend']}>
    <Row>
      <Col xs={6} className="header">
        Outline
      </Col>
      <Col xs={6} className="header">
        Non-compliance
      </Col>
    </Row>
    {renderEachLegend(legendData)}
  </div>
);

export default DiabetesLegend;