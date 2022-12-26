'use strict';

const userModel =function (email, password, firstName, lastName) {
    return {
        email,
        password,
        firstName,
        lastName
    };
}

module.exports = userModel;