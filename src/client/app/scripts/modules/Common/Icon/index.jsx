import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Icon = ({ iconClassName, ...props }) => {
  return (
    <i
      className={classNames(styles.icon, `icon-${iconClassName}`, { 'display-icon': props.displayIcon })}
      {...props}
    />
  );
};

Icon.propTypes = {
  iconClassName: PropTypes.string.isRequired,
  displayIcon: PropTypes.boolean,
};

Icon.defaultProps = {
  displayIcon: false,
};

/* Different icon required at different places */
export const SearchIcon = props => <Icon iconClassName="search" {...props} />;
export const ToggleSwitchOnIcon = props => <Icon iconClassName="switch-on" {...props} />;
export const ToggleSwitchOffIcon = props => <Icon iconClassName="switch-off" {...props} />;
export const EmailIcon = props => <Icon iconClassName="email" {...props} />;
export const PhoneIcon = props => <Icon iconClassName="phone" {...props} />;
export const LogoIcon = props => <Icon iconClassName="logo" {...props} />;
export const TagIcon = props => <Icon iconClassName="bg" {...props} />;
export const PlusIcon = props => <Icon iconClassName="plus" {...props} />;
export const ValidInputIcon = props => <Icon iconClassName="check" {...props} />;
export const WarningIcon = props => <Icon iconClassName="warning" {...props} />;
export const MedsIcon = props => <Icon iconClassName="meds" {...props} />;
export const StethoscopeIcon = props => <Icon iconClassName="stethoscope" {...props} />;
export const VitalsIcon = props => <Icon iconClassName="vitals" {...props} />;
export const CalendarIcon = props => <Icon iconClassName="calendar" {...props} />;
export const UpRightArrowIcon = props => <Icon iconClassName="up-right-arrow" {...props} />;
export const RadioOff = props => <Icon iconClassName="radio-off" {...props} />;
export const ExchangeIcon = props => <Icon iconClassName="exchange" {...props} />;
export const ClockIcon = props => <Icon iconClassName="clock" {...props} />;
export const FilterIcon = props => <Icon iconClassName="filter" {...props} />;
export const SortAscIcon = props => <Icon iconClassName="sort-asc" {...props} />;
export const SortDescIcon = props => <Icon iconClassName="sort-desc" {...props} />;
export const A1cIcon = props => <Icon iconClassName="a1c" {...props} />;

export const WakeupIcon = props => <Icon iconClassName="wakeup" {...props} />;
export const BreakfastIcon = props => <Icon iconClassName="breakfast" {...props} />;
export const LunchIcon = props => <Icon iconClassName="lunch" {...props} />;
export const DinnerIcon = props => <Icon iconClassName="dinner" {...props} />;
export const BedtimeIcon = props => <Icon iconClassName="bedtime" {...props} />;
export const DropdownIcon = props => <Icon iconClassName="dropdown" {...props} />;
export const ModalWarningIcon = props => <Icon iconClassName="modal-warning" {...props} />;

export default Icon;
