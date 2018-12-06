module.exports = (sequelize, DataTypes) => {
    return sequelize.define('answer',
        {
            'answer': {
                type: DataTypes.STRING,
                defaultValue: "#"
            }, 
            'started': {
                type: DataTypes.BIGINT(11),
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}   