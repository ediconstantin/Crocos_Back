module.exports = (sequelize, DataTypes) => {
    return sequelize.define('answer',
        {
            'answer': DataTypes.INTEGER,
        }, {
            underscored: true
        })
}   