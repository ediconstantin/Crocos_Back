module.exports = (sequelize, DataTypes) => {
    return sequelize.define('question',
        {
            'question': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'ans1': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'ans2': {
                type: DataTypes.STRING,
                allowNull: false
            },
            'ans3': {
                type: DataTypes.STRING,
                defaultValue: '#'
            },
            'ans4': {
                type: DataTypes.STRING,
                defaultValue: '#'
            },
            'correct': {
                type: DataTypes.STRING,
                allowNull: false
            },
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