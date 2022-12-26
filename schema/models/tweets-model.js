'use-strict';

const tweetsModel = function (content, userId, contentType) {
    return {
        content,
        userId,
        contentType: contentType || 'text'
    }
};

module.exports = tweetsModel;