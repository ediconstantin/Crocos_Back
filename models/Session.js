module.exports = (sequelize, DataTypes) => {
    return sequelize.define('session',
        {
            'token': {
                type: DataTypes.STRING,
                unique: true
            },
            'date': DataTypes.DATEONLY,
            'start_hour': DataTypes.BIGINT(11),
            'end_hour': DataTypes.BIGINT(11),
            'duration': DataTypes.INTEGER,
            'isPublic': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}