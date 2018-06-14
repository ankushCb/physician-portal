const validPhoneNoPattern = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

export default (errMsg = 'Please enter valid phone number') => value => (!validPhoneNoPattern.test(value) ? errMsg : undefined);
