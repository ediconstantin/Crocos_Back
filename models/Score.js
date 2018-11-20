module.exports = (sequelize, DataTypes) => {
    return sequelize.define('score',
        {
            'score': DataTypes.INTEGER
        }, {
            underscored: true
        })
}