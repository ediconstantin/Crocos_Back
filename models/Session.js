module.exports = (sequelize, DataTypes) => {
    return sequelize.define('session',
        {
            'token': {
                type: DataTypes.STRING,
                unique: true
            },
            'start_hour': DataTypes.BIGINT(11),
            'end_hour': DataTypes.BIGINT(11),
            'strict_timed': {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            'status': {
                type: DataTypes.INTEGER(1),
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}