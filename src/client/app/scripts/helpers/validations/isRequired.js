export default (errMsg = 'Please enter a value') => value => (!value ? errMsg : undefined);
