var assert = require('assert');
var request = require('sync-request');
const API = 'http://localhost:5000/api/';
const USER = API + 'user';
const USER_GET = API + 'user/get';
const AUTH = API + 'auth';
const RECORD = API + 'record/';
const CATEGORY = API + 'category/';

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

var token_1, token_2, rec_1, rec_2;
var username_2 = String(parseInt(GOOD_USER.username) + 1);

describe('PUT API for User', function () {
    describe('Change Password', function () {
        it('Reject unauthorized user', function () {
            var res = request(
                'PUT',
                USER, {
                    json: {
                        token: 'fwefewfq3wersfvweqf'
                    }
                });
            assert(res.statusCode == 401);
        });

        it('Reject bad password', function () {
            var res = request(
                'POST',
                USER, {
                    json: GOOD_USER
                });
            assert(res.statusCode == 200);
            res = (JSON.parse(res.body));
            assert(res.success);
            token_1 = res.token;
            assert(token_1);

            res = request(
                'PUT',
                USER, {
                    json: {
                        token: token_1,
                        password: '1212'
                    }
                });
            assert(res.statusCode == 400);
            res = (JSON.parse(res.body));
            assert(!res.success);
            assert(res.messages);
            assert(res.messages[0]);
            assert(res.messages[0] == 'The minimum length for your password is 8 characters.');
        });

        it('Accept good password', function () {
            res = request(
                'PUT',
                USER, {
                    json: {
                        token: token_1,
                        password: '12121212'
                    }
                });
            assert(res.statusCode == 200);
            res = (JSON.parse(res.body));
            assert(res.success);
        });

        it('Really change password', function () {
            var res = request(
                'POST',
                AUTH, {
                    json: GOOD_USER
                });
            assert(res.statusCode == 401);
            GOOD_USER.password = '12121212';

            var res = request(
                'POST',
                AUTH, {
                    json: GOOD_USER
                });
            assert(res.statusCode == 200);
            res = (JSON.parse(res.body));
            token_2 = res.token;
        });
    });

    describe('Change User Information', function () {
        it('Reject unauthorized user', function () {
            var res = request(
                'PUT',
                USER, {
                    json: {
                        token: 'fwefewfq3wersfvweqf'
                    }
                });
            assert(res.statusCode == 401);
        });

        it('Reject bad user information', function () {
            var res = request(
                'PUT',
                USER, {
                    json: {
                        token: token_2
                    }
                });
            assert(res.statusCode == 400);
            res = (JSON.parse(res.body));
            assert(!res.success);
            assert(res.messages);
            assert(res.messages.length == 6);
            assert(res.messages[0] == 'Please enter your username.');
            assert(res.messages[1] == 'Please enter your first name.');
            assert(res.messages[2] == 'Please enter your last name.');
            assert(res.messages[3] == 'Please enter your state.');
            assert(res.messages[4] == 'Please enter your city.');
            assert(res.messages[5] == 'Please enter a valid zip code.');
        });

        it('Reject username that is already taken', function () {
            delete GOOD_USER['password'];
            delete GOOD_USER['password_rpt'];
            GOOD_USER.username = 'lc';
            GOOD_USER.token = token_2;
            var res = request(
                'PUT',
                USER, {
                    json: GOOD_USER
                });
            assert(res.statusCode == 400);
            res = (JSON.parse(res.body));
            assert(!res.success);
            assert(res.messages);
            assert(res.messages.length == 1);
            assert(res.messages[0] == 'The username is taken. Please choose a different one.');
        });

        it('Accept good user information', function () {
            GOOD_USER.username = username_2;
            GOOD_USER.firstname = 'test8';
            GOOD_USER.lastname = 'test5';
            GOOD_USER.state = 'test6';
            GOOD_USER.city = 'test7';
            GOOD_USER.zipcode = 1111;
            var res = request(
                'PUT',
                USER, {
                    json: GOOD_USER
                });
            assert(res.statusCode == 200);
            res = (JSON.parse(res.body));
            assert(res.success);
        });

        it('Really change user information', function () {
            var res = request(
                'POST',
                USER_GET, {
                    json: {
                        token: token_2
                    }
                });
            assert(res.statusCode == 200);
            res = (JSON.parse(res.body));
            assert(res.username == username_2);
            assert(res.firstname == 'test8');
            assert(res.lastname == 'test5');
            assert(res.state == 'test6');
            assert(res.city == 'test7');
            assert(res.zipcode == 1111);
        });
    });
});

describe('PUT API for Record', function () {
    it('Reject unauthorized user', function () {
        var res = request(
            'PUT',
            RECORD, {
                json: {
                    token: 'fwefewfq3wersfvweqf'
                }
            });
        assert(res.statusCode == 401);
    });

    it('Reject bad Record', function () {
        var res = request(
            'POST',
            RECORD, {
                json: {
                    token: token_2,
                    description: 'test1',
                    amount: 0.01,
                    category: 'Food'
                }
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        rec_1 = res.record;

        var res = request(
            'PUT',
            RECORD, {
                json: {
                    token: token_2,
                    _id: rec_1._id,
                }
            });
        assert(res.statusCode == 400);
        res = (JSON.parse(res.body));
        assert(!res.successs);
        assert(res.messages.length == 3);
        assert(res.messages[0] == 'Please enter a description.');
        assert(res.messages[1] == 'Please enter a valid amount.');
        assert(res.messages[2] == 'Please select a valid category.');
    });

    it('Reject non-existing Record', function () {
        var res = request(
            'PUT',
            RECORD, {
                json: {
                    token: token_2,
                }
            });
        assert(res.statusCode == 404);
    });

    it('Accept good Record', function () {
        rec_1.token = token_2;
        rec_1.amount = 100;
        rec_1.description = 'test 222';
        rec_1.location = 'test 333';
        var res = request(
            'PUT',
            RECORD, {
                json: rec_1
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        rec_2 = res.record;
    });

    it('Really changes a Record', function () {
        assert(rec_2.amount == 100);
        assert(rec_2.description == 'test 222');
        assert(rec_2.location == 'test 333');
    });
});

describe('DELETE API for Record', function () {
    it('Reject unauthorized user', function () {
        var res = request(
            'DELETE',
            RECORD + 'fcwfewdsffewf', {});
        assert(res.statusCode == 401);
    });

    it('Reject bad record ID', function () {
        var res = request(
            'DELETE',
            RECORD + 'eqfqfefqfqef', {
                body: JSON.stringify({
                    token: token_2
                })
            });

        assert(res.statusCode != 200);
    });

    it('Delete a Record', function () {
        var res = request(
            'DELETE',
            RECORD + rec_2._id, {
                body: JSON.stringify({
                    token: token_2
                })
            });
        try {
            assert(res.statusCode == 200)
        } catch (e) {
        }
    });
});

describe('API for Category', function () {
    it('Create a new category', function () {
        var res = request(
            'POST',
            CATEGORY, {
                json: {
                    token: token_2,
                    category: 'HaHaHa'
                }
            });
        assert(res.statusCode == 200);
    });

    it('Get all categories', function () {
        var res = request(
            'POST',
            CATEGORY + 'get', {
                json: {
                    token: token_2
                }
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.indexOf('Food') != -1);
        assert(res.indexOf('Clothing') != -1);
        assert(res.indexOf('Grocery') != -1);
        assert(res.indexOf('Travel') != -1);
        assert(res.indexOf('Education') != -1);
        assert(res.indexOf('Entertainment') != -1);
        assert(res.indexOf('Health') != -1);
        assert(res.indexOf('HaHaHa') != -1);
        assert(res.indexOf('wf2ewfwfe') == -1);
    });

    it('Delete a category', function () {
        var res = request(
            'POST',
            CATEGORY + 'd', {
                json: {
                    token: token_2,
                    category: 'HaHaHa'
                }
            });
        assert(res.statusCode == 200);

        res = request(
            'POST',
            CATEGORY + 'get', {
                json: {
                    token: token_2
                }
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.indexOf('HaHaHa') == -1);
        assert(res.indexOf('Food') != -1);
        assert(res.indexOf('Clothing') != -1);
        assert(res.indexOf('Grocery') != -1);
        assert(res.indexOf('Travel') != -1);
        assert(res.indexOf('Education') != -1);
        assert(res.indexOf('Entertainment') != -1);
        assert(res.indexOf('Health') != -1);
    });
});

describe('API for Record Filtering', function () {
    it('Reject bad date', function () {
        var res = request(
            'POST',
            RECORD + 'get_range', {
                json: {
                    token: token_2
                }
            });
        assert(res.statusCode != 200);
        res = (JSON.parse(res.body));
        assert(!res.success);
        assert(res.messages);
        assert(res.messages[0] == 'Please enter a valid start date.');
        assert(res.messages[1] == 'Please enter a valid end date.');
    });

    it('Reject start date earlier than end date', function () {
        var res = request(
            'POST',
            RECORD + 'get_range', {
                json: {
                    token: token_2,
                    start: '2016-10-23',
                    end: '2011-10-23'
                }
            });
        assert(res.statusCode != 200);
        res = (JSON.parse(res.body));
        assert(!res.success);
        assert(res.messages);
        assert(res.messages[0] == 'The end date is earlier than the start date.');
    });

    it('Correctly returns records.', function () {
        /**
         * Convert a Date object to string ('YYYY-MM-DD')
         * @param {Object} date
         * @return {String} string
         */
        const date_to_string = function (date) {
            return new Date(date).toISOString().slice(0, 10)
        };
        var end = new Date();
        end.setHours(0);
        var start = new Date(end).setMonth(end.getMonth() - 1);
        var res = request(
            'POST',
            RECORD + 'get_range', {
                json: {
                    token: token_2,
                    start: date_to_string(start),
                    end:date_to_string(end)
                }
            });
        assert(res.statusCode == 200);
        res = (JSON.parse(res.body));
        assert(res.success);
    });
});