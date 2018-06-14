/**
 * root JS file: exports as a HOC wrapped components
 */
import { withFormsy } from 'formsy-react';

import ToggleSwitchBox from './ToggleSwitch.jsx';
import CheckBoxWithIcon from './CheckBoxWithIcon.jsx';

export const ToggleSwitch = withFormsy(ToggleSwitchBox);
export const CheckWithIcon = withFormsy(CheckBoxWithIcon);
