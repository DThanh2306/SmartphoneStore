function setUserSessionCookie(res, userAcc, userRole) {
    res.cookie('user_session', userAcc, {
        httpOnly: true,
        secure: false,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('user_role', userRole, {
        httpOnly: true,
        secure: false,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
    });
}

function clearUserSessionCookie(res) {
    res.clearCookie('user_session');
    res.clearCookie('user_role');
}

module.exports = {
    setUserSessionCookie,
    clearUserSessionCookie,
};