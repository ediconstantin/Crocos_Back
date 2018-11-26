module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user',
        {
            'firstname': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'lastname': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'email': {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            'isProf': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            },
            'isAdmin': {
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