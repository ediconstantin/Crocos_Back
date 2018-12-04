const UserSession = require('../../models').UserSession;
const AppError = require('../utils/AppError').AppError;

let createErrorMessage = (retries) => {
    if (retries === 1) {
        return 'The test could only be taken 1 time.';
    }
    return 'The test could only be taken ' + retries + ' times.';
}

module.exports.validateNewUserSession = async (testId, retries, user_id) => {

    let userSessions = await UserSession.count({
        where: {
            test_id: testId,
            user_id: user_id
        }
    });

    if (userSessions >= retries) {
        throw new AppError(createErrorMessage(retries), 400);
    }
}