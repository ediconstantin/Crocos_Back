module.exports = (sequelize, DataTypes) => {
    return sequelize.define('test',
        {
            'description': DataTypes.STRING,
            'name': DataTypes.STRING,
            'duration': DataTypes.INTEGER,
            'questionsNumber': DataTypes.INTEGER,
            'retries': {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            'backwards': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            },
            'isPublic': {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}