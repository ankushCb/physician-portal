import React from 'react';

import InputNumber from '../InputNumber';

const InputCarbRatioDisplay = props => (
  <div>
    <InputNumber {...props} />
    <span className="carb-count-text">to 1</span>
  </div>
);

export default InputCarbRatioDisplay;
