module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_session', {
        'isOpen': DataTypes.BOOLEAN,
        'started': DataTypes.BIGINT(11)
    },
        {
            underscored: true
        })
}