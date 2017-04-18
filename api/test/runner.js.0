var assert = require('assert');
var request = require('sync-request');
const API = 'http://localhost:5000/api/';
const USER = API + 'user';
const AUTH = API + 'auth';
const RECORD = API + 'record';

const GOOD_USER = {
    username: String(Math.floor(Date.now()/1000)),
    password:'11111111',
    password_rpt:'11111111',
    firstname:'test1',
    lastname:'test2',
    state:'test3',
    city:'test4',
    zipcode:0000
};

var token;
describe('user', function () {
    it('Rejects bad user information.', function () {
        var res = request(
        'POST',
        USER, {
            json: {}
        });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(res.messages.includes('Please enter your username.'));
        assert(res.messages.includes('The minimum length for your password is 8 characters.'));
        assert(res.messages.includes('Please enter your first name.'));
        assert(res.messages.includes('Please enter your last name.'));
        assert(res.messages.includes('Please enter your state.'));
        assert(res.messages.includes('Please enter your city.'));
        assert(res.messages.includes('Please enter a valid zip code.'));
    });

    it('Rejects mismatched password.', function () {
        var res = request(
        'POST',
        USER, {
            json: {
                username:'mismatch',
                password:'11111111',
                password_rpt:'22222222',
                firstname:'test1',
                lastname:'test2',
                state:'test3',
                city:'test4',
                zipcode:0000
            }
        });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(res.messages.includes('Your password and confirmation password do not match.'));
    });

    it('Creates account when all info is correct.', function () {
        var res = request(
        'POST',
        USER, {
            json: GOOD_USER
        });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.success);
        token = res.token;
        assert(token);
    });

    it('Rejects duplicate username.', function () {
        var res = request(
            'POST',
            USER, {
                json: GOOD_USER
            });
        assert(res.statusCode != 200);
        res = (JSON.parse(res.body));
        assert(res.messages.includes('The username is taken. Please choose a different one.'));
    });
});


describe('auth', function () {
    it('Rejects bad username and password.', function () {
        var res = request(
        'POST',
        AUTH, {
            json: {
                username: 'bad',
                password: 'bad'
            }
        });
        assert(res.statusCode == 401);
    });

    it('Rejects bad token.', function () {
        var res = request(
        'POST',
        AUTH, {
            json: {
                token: 'bad',
            }
        });
        assert(res.statusCode == 401);
    });

    it('Accepts good username and password.', function () {
        var res = request(
        'POST',
        AUTH, {
            json: GOOD_USER
        });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        token = res.token;
    });


    it('Accepts good token.', function () {
        var res = request(
        'POST',
        AUTH, {
            json: {
                token: token
            }
        });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        token = res.token;
        assert(token);
    });
});

describe('record', function () {
    it('Rejects bad record.', function () {
        var res = request(
        'POST',
        RECORD, {
            json: {
               token:token
            }
        });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(res.messages.includes('Please enter a description.'));
        assert(res.messages.includes('Please enter a valid amount.'));
        assert(res.messages.includes('Please select a valid category.'));
    });

    it('Accepts good record 1.', function () {
        var res = request(
        'POST',
        RECORD, {
            json: {
               token:token,
               description:'test1',
               amount:0.01,
               category:'Food'
            }
        });
        assert(res.statusCode == 200);
    });

    it('Accepts good record 2.', function () {
        var res = request(
        'POST',
        RECORD, {
            json: {
               token:token,
               description:'test2',
               amount:100,
               category:'Grocery'
            }
        });
        assert(res.statusCode == 200);
    });

    it('Return all records.', function () {
        var res = request(
        'POST',
        'http://localhost:5000/api/record/get_all', {
            json: {
               token:token,
            }
        });
        assert(res.statusCode == 200);
    });
});
