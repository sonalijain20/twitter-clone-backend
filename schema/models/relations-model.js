'use-strict';

const relationModel = function (followeeId, followerId) {
    return {
        followeeId,
        followerId
    }
}

module.exports = relationModel;