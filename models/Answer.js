module.exports = (sequelize, DataTypes) => {
    return sequelize.define('answer',
        {
            'answer': {
                type: DataTypes.STRING,
                defaultValue: "#"
            }
        }, {
            underscored: true
        })
}   