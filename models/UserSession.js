module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_session', {},
        {
            underscored: true
        })
}