module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category',
        {
            'name': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'description': DataTypes.STRING,
            'photo': DataTypes.STRING,
        }, {
            underscored: true
        })
}