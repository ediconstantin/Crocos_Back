module.exports = (sequelize, DataTypes) => {
    return sequelize.define('series',
        {
            'name': DataTypes.STRING,
            'year': DataTypes.INTEGER
        }, {
            underscored: true
        })
}