module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user',
        {
            'token': DataTypes.STRING,
            'firstname': DataTypes.STRING,
            'lastname': DataTypes.STRING,
            'email': DataTypes.STRING,
            'photo': DataTypes.STRING,
            'isProf': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            },
            'isActive': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}