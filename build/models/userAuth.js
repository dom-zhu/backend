"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getUsername = exports.login = exports.getHash = exports.checkUserExists = exports.registerUser = void 0;
var monk = require('monk');
var MONGO_CONN_STRING = process.env.URI;
var sha256 = require('crypto-js/sha256');
var bcrypt = require('bcryptjs');
var db = monk(MONGO_CONN_STRING);
var users = db.get('users');
// checks if the user exists
function checkUserExists(username) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users.find({ username: username })];
                case 1:
                    result = _a.sent();
                    if (result.length !== 0)
                        return [2 /*return*/, true];
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.checkUserExists = checkUserExists;
// TODO convert to jsdoc
// gets the hash for the given username
function getHash(username) {
    return __awaiter(this, void 0, void 0, function () {
        var result, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users.findOne({ username: username })];
                case 1:
                    result = _a.sent();
                    hash = result.hash;
                    return [2 /*return*/, hash];
            }
        });
    });
}
exports.getHash = getHash;
/** Gets the username for the sessionID */
function getUsername(sessionID) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users.findOne({ accessToken: sessionID })];
                case 1:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, result.username];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getUsername = getUsername;
function storeAccessToken(username, accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            users.update({ username: username }, { $set: { accessToken: accessToken } });
            return [2 /*return*/];
        });
    });
}
// TODO put logic in controller
// logs the user in
function login(user) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, serverHash, a, accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = user.username;
                    password = user.password;
                    return [4 /*yield*/, checkUserExists(username)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, getHash(username)];
                case 2:
                    serverHash = _a.sent();
                    return [4 /*yield*/, bcrypt.compare(password, serverHash)];
                case 3:
                    if (_a.sent()) {
                        a = Math.floor(Math.random() * 999999999);
                        accessToken = sha256(a.toString()).toString();
                        // store session id in db
                        storeAccessToken(username, accessToken);
                        return [2 /*return*/, accessToken];
                        // return username
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
// saves the user's credentials
// TODO put checks in controller, model only for insert
function registerUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var password, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkUserExists(user.username)];
                case 1:
                    // console.log(user.username)
                    if (_a.sent()) {
                        console.log('user exists');
                        return [2 /*return*/];
                    }
                    password = user.password;
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 2:
                    hash = (_a.sent()).toString();
                    users.insert({
                        username: user.username,
                        hash: hash
                    });
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.registerUser = registerUser;
