import jwt from "jsonwebtoken";
import {promisify} from "util";

import AuthExecption from "./AuthException.js";

import * as secrets from "../constant/Secrets.js";
import * as httpStatus from "../constant/HttpStatus.js"


const emptySpace = " ";


export default async(req,res,next) => {
    try {
    const {authorization} = req.headers;
        if(!authorization) {
            throw new AuthExecption(httpStatus.UNAUTHORIZED, "Acess token was not informed.");
        }
        let accessToken = authorization;
        if (accessToken.includes(emptySpace)){
            accessToken = accessToken.split(emptySpace)[1];
        }
            const decoded = await promisify(jwt.verify)(accessToken,secrets.API_SECRET);
            req.authUser = decoded.authUser;
            return next();

    } catch (error) {
        const status = error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR;
        return res.status(status).json({status,message: error.message});
    }
}