const { isAdmin } = require('./admin');

function canViewOwnerInfo(user, ownerInfo) { //only admin or the owner himself can view his info
    return (
        isAdmin(user) ||
        ownerInfo.owner_name === user.username
    )
}

function canUpdateOwnerInfo(user, ownerInfo) { //only admin or the owner himself can view his info
    return (
        isAdmin(user) ||
        ownerInfo.owner_name === user.username
    )
}

module.exports = {
    canViewOwnerInfo,
    canUpdateOwnerInfo
}