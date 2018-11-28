const database = require('./database.js');
const User = database.import('./User');
const Group = database.import('./Group');
const Series = database.import('./Series');
const Question = database.import('./Question');
const Category = database.import('./Category');
const Test = database.import('./Test');
const Session = database.import('./Session');
const UserSession = database.import('./UserSession');
const Answer = database.import('./Answer');
const Score = database.import('./Score');

Series.hasMany(Group, { as: 'Groups' });
Group.hasMany(User, { as: 'Users' });
User.hasMany(Question, { as: 'Questions' });
User.hasMany(Test, { as: 'Tests' });
User.hasMany(UserSession, { as: 'UserSessions' });
Question.hasMany(Answer, { as: 'Answers' });
Question.belongsToMany(Test, { through: 'test_question', as: 'Tests'});
Question.belongsTo(Category);
Category.hasMany(Question, { as: 'Questions' });
Category.hasMany(Test, { as: 'Tests' });
Test.hasMany(Session, { as: 'Sessions' });
Test.hasMany(UserSession, { as: 'UserSessions' });
Test.belongsToMany(Test, { through: 'test_question', as: 'Questions'});
Session.hasMany(UserSession, { as: 'UserSessions' });
UserSession.hasMany(Answer, { as: 'Answers' });
UserSession.hasOne(Score, { as: 'Score' });

module.exports = {
    database,
    User,
    Group,
    Series,
    Question,
    Category,
    Test,
    Session,
    UserSession,
    Answer,
    Score
}