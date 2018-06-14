import toArray from 'lodash/toArray';
import sortBy from 'lodash/sortBy';

const timeSlots = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];

export default timeWindows => sortBy(toArray(timeWindows), option => timeSlots.indexOf(option.name));
