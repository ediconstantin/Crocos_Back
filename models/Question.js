module.exports = (sequelize, DataTypes) => {
    return sequelize.define('question',
        {
            'question': DataTypes.STRING,
            'ans1': DataTypes.INTEGER,
            'ans2': DataTypes.INTEGER,
            'ans3': DataTypes.INTEGER,
            'ans4': DataTypes.INTEGER,
            'correct': DataTypes.INTEGER,
            'feedback': DataTypes.STRING,
            'photo': DataTypes.STRING,
            'multiple': {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            'open': {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            'duration': {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            underscored: true
        })
}