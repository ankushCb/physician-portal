const validTimePattern = /(0?[0-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)/;

export default (errMsg = 'Please enter a valid time') => value => (!validTimePattern.test(value) ? errMsg : undefined);
