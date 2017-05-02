var assert = require('assert');
var request = require('sync-request');
const API = 'http://localhost:5000/api/';
const USER = API + 'user';
const USER_GET = API + 'user/get';
const AUTH = API + 'auth';
const RECORD = API + 'record';
const CHANGE_PASSWORD = API + 'security/change_password'
const DEAUTHORIZE = API + 'security/deauthorize'

const GOOD_USER = {
    username: String(Math.floor(Date.now() / 1000)),
    password: '11111111',
    password_rpt: '11111111',
    firstname: 'test1',
    lastname: 'test2',
    state: 'test3',
    city: 'test4',
    zipcode: 0000
};
var user;

var token;
describe('POST user with budget', function () {
    it('Rejects user information without budget.', function () {
        var res = request(
            'POST',
            USER, {
                json: GOOD_USER
            });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(res.messages.length == 1);
        assert(res.messages[0] == 'Please enter a valid budget.');
    });

    it('Rejects user information without incorrect budget.', function () {
        GOOD_USER.budget = 'wfeefwrf';
        var res = request(
            'POST',
            USER, {
                json: GOOD_USER
            });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(res.messages.length == 1);
        assert(res.messages[0] == 'Please enter a valid budget.');
    });

    it('Creates account when all info is correct.', function () {
        GOOD_USER.budget = 1000.0;
        var res = request(
            'POST',
            USER, {
                json: GOOD_USER,
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.success);
        token = res.token;
        assert(token);
    });
});

describe('GET user with budget', function () {
    it('Get user information with correct budget.', function () {
        var res = request(
            'POST',
            USER_GET, {
                json: {
                    token: token
                }
            });
        user = (JSON.parse(res.body));
        assert(user.budget == 1000.0);
    });
});

describe('PUT user with budget', function () {
    it('Reject changing user information without budget', function () {
        delete user['budget'];
        user.token = token;
        var res = request(
            'PUT',
            USER, {
                json: user
            });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(!res.success);
        assert(res.messages.length == 1);
        assert(res.messages[0] == 'Please enter a valid budget.');
    });

    it('Reject changing user information with incorrect budget', function () {
        user['budget'] = 'eqfewfeqf';
        user.token = token;
        var res = request(
            'PUT',
            USER, {
                json: user
            });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(!res.success);
        assert(res.messages.length == 1);
        assert(res.messages[0] == 'Please enter a valid budget.');
    });

    it('Change user information with correct budget', function () {
        user['budget'] = 200.0;
        user.token = token;
        var res = request(
            'PUT',
            USER, {
                json: user
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.success);
    });

    it('Really change user information with correct budget', function () {
        var res = request(
            'POST',
            USER_GET, {
                json: {
                    token: token
                }
            });
        user = (JSON.parse(res.body));
        assert(user.budget == 200.0);
    });
});

var token_2;
describe('Change Password', function () {
    it('Rejects incorrect old password.', function () {
        var res = request(
            'POST',
            CHANGE_PASSWORD, {
                json: {
                    username: GOOD_USER.username,
                    password: 'bad',
                    new_password: '22222222'
                }
            });
        assert(res.statusCode == 401);
    });

    it('Accepts correct old password.', function () {
        var res = request(
            'POST',
            CHANGE_PASSWORD, {
                json: {
                    username: GOOD_USER.username,
                    password: GOOD_USER.password,
                    new_password: '22222222'
                }
            });
        assert(res.statusCode == 200);
    });

    it('Changes password.', function () {
        var res = request(
            'POST',
            AUTH, {
                json: {
                    username: GOOD_USER.username,
                    password: '22222222'
                }
            });
        assert(res.statusCode == 200);
        res = JSON.parse(res.body);
        token_2 = res.token;
        assert(token_2);

        res = request(
            'POST',
            AUTH, {
                json: {
                    username: GOOD_USER.username,
                    password: GOOD_USER.password
                }
            });
        assert(res.statusCode == 401);
    });

    it('Revokes other token after password change.', function () {
        var res = request(
            'POST',
            AUTH, {
                json: {
                    token: token
                }
            });
        assert(res.statusCode == 401);
    });
});

var token_3;
describe('Deauthorize', function () {
    it('Rejects incorrect password.', function () {
        var res = request(
            'POST',
            DEAUTHORIZE, {
                json: {
                    username: GOOD_USER.username,
                    password: 'bad',
                }
            });
        assert(res.statusCode == 401);
    });

    it('Accepts correct password.', function () {
        var res = request(
            'POST',
            DEAUTHORIZE, {
                json: {
                    username: GOOD_USER.username,
                    password: '22222222',
                }
            });
        assert(res.statusCode == 200);
        res = JSON.parse(res.body);
        token_3 = res.token;
    });

    it('Revokes other tokens.', function () {
        var res = request(
            'POST',
            AUTH, {
                json: {
                    token: token
                }
            });
        assert(res.statusCode == 401);
        res = request(
            'POST',
            AUTH, {
                json: {
                    token: token_2
                }
            });
        assert(res.statusCode == 401);
    });

    it('Returns valid new token.', function () {
        var res = request(
            'POST',
            AUTH, {
                json: {
                    token: token_3
                }
            });
        assert(res.statusCode == 200);
        res = JSON.parse(res.body);
        assert(res.token);
    });
});