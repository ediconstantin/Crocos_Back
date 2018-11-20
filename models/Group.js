module.exports = (sequelize, DataTypes) => {
    return sequelize.define('group',
        {
            'name': DataTypes.STRING,
        }, {
            underscored: true
        })
}