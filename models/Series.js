module.exports = (sequelize, DataTypes) => {
    return sequelize.define('series',
        {
            'name': DataTypes.STRING,
        }, {
            underscored: true
        })
}