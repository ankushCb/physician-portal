/**
 * root JS file: exports as a HOC wrapped component
 */
import Formsy from 'formsy-react'; // eslint-disable-line
import { withFormsy } from 'formsy-react';
import InputSelectbox from './InputSelect';
import InputNumberDisplay from './InputNumber';
import InputCheckBox from './InputCheck';
import InputCarbRatioDisplay from './InputCarbRatio';
import InputTextBox from './InputText';
import SimpleInputCheckBox from './SimpleInputCheck';
// import InputRadioButtonGroup from './InputRadioButton.js';
// import InputRangeSliders from './InputRangeSlider.js';
// import InputEditableTime from './InputEditableTime.js';
// import InputNumberDisplay from './InputNumber.js';


export const InputSelect = withFormsy(InputSelectbox);
export const InputNumber = withFormsy(InputNumberDisplay);
export const InputCheck = withFormsy(InputCheckBox);
export const InputCarbRatio = withFormsy(InputCarbRatioDisplay);
export const InputText = withFormsy(InputTextBox);
export const SimpleInputCheck = withFormsy(SimpleInputCheckBox)
// export const InputRadioButton = withFormsy(InputRadioButtonGroup);
// export const InputRangeSlider = withFormsy(InputRangeSliders);
// export const InputTime = withFormsy(InputEditableTime);

