"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOPT = void 0;
const sendOPT = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.sendOPT = sendOPT;
/*
const crypto = require('crypto');

function generateOTP() {
  return crypto.randomInt(100000, 999999);
}

console.log(generateOTP());
*/ 
