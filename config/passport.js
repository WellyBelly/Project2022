const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return done(null, false, { message: 'User not found' });
            } else {
                const user = results.results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE user_id = $1;', [id]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            const user = results.results[0];
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });
}