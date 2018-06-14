import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-toolbox/lib/card';

import theme from './theme.scss';

/* Wrap with a width to reduce the size */
/* Height will span as per the content */
const CardWrapper = ({ children, TitleComponent, Title, additionalClass, shouldDisableCard }) => (
  <div style={shouldDisableCard ? { pointerEvents: 'none' } : {}}>
    <Card theme={theme} className={additionalClass}>
      { TitleComponent ? <TitleComponent /> : <span className="title">{Title}</span> }
      <div>
        {children}
      </div>
    </Card>
  </div>
);

CardWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  TitleComponent: PropTypes.node,
  Title: PropTypes.string,
  additionalClass: PropTypes.string,
  shouldDisableCard: PropTypes.bool,
};

CardWrapper.defaultProps = {
  children: null,
  TitleComponent: null,
  Title: '',
  additionalClass: '',
  shouldDisableCard: false,
};

export default CardWrapper;
