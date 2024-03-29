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
Group.belongsTo(Series);
User.hasMany(Question, { as: 'Questions' });
User.hasMany(Test, { as: 'Tests' });
User.hasMany(Session, { as: 'Sessions' });
User.hasMany(UserSession, { as: 'UserSessions' });
User.belongsTo(Group);
Question.hasMany(Answer, { as: 'answers' });
Question.belongsToMany(Test, { through: 'test_question' });
Question.belongsTo(Category);
Category.hasMany(Question, { as: 'Questions' });
Category.hasMany(Test, { as: 'Tests' });
Test.hasMany(Session, { as: 'Sessions' });
Test.belongsTo(Category);
Test.belongsToMany(Question, { through: 'test_questions' });
Session.hasMany(UserSession, {as: "UserSessions"});
Session.belongsTo(Test);
UserSession.hasMany(Answer, { as: 'answers' });
UserSession.hasOne(Score, { as: 'Score' });
UserSession.belongsTo(Session);
UserSession.belongsTo(User);
Answer.belongsTo(Question);

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