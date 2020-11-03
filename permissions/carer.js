const { isAdmin } = require('./admin');

function canViewPetDayInfo(user, carerInfo) { //only admin or the carer himself can view his petday info
    return (
        isAdmin(user) ||
        carerInfo.carer_name === user.username
    )
}

module.exports = {
    canViewPetDayInfo
    
}