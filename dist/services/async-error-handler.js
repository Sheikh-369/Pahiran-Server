"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.log(err, "ERROR");
            return res.status(500).json({
                message: err.message,
                fullError: err
            });
        });
    };
};
exports.default = asyncErrorHandler;
