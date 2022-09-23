import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userRepository  from "../reporsitory/UserRepository.js";
import * as  httpStatus from "../../../config/constant/HttpStatus.js";
import UserExecption from "../model/exception/UserException.js";
import UserRepository from "../reporsitory/UserRepository.js";
import * as secrets from "../../../config/constant/Secrets.js"


class UserService{

    async findByEmail(req) {
        try {
            const{email} = req.params;
            const{authUser} = req;
            this.validateRequestData(email);
            let user = await userRepository.findByEmail(email);
            this.validateUserNotFound(user);
            this.validateAutenticatedUser(user,authUser);
            return {
                status: httpStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }   
            }
            
        } catch (error) {
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: console.log(error),
            }
        }
    }

    async getAccessToken(req) {
        try {
            const {email, password} = req.body;
            this.validateAcessTokenData(email, password);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            await this.validatePassword(password,user.password);
            const authUser = { id: user.id,name: user.name, email: user.email}
            const AccessToken = jwt.sign({authUser},secrets.API_SECRET,{expiresIn: '1d'})
            return {
                status: httpStatus.SUCCESS,
                AccessToken,
            }
        } catch (error) {
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: console.log(error),
            }
            
        }
        

    }

    validateAcessTokenData(email, password) {
        if(!email || !password) {
            throw new UserExecption(httpStatus.UNAUTHORIZED, "Email and password must be informed.")
        }
    }

    async validatePassword(password,hashPassword) {
        if (!await bcrypt.compare(password,hashPassword)) {
            throw new UserExecption(httpStatus.UNAUTHORIZED, "Password doesn't match.  ")
        }
    }

    validateRequestData(email){
        if(!email) {
            throw new UserExecption(httpStatus.INTERNAL_SERVER_ERROR,"User email was not informed.");
        }
    }

    validateUserNotFound(user) {
        if(!user) {
            throw new Error(httpStatus.NOT_FOUND,"User was not found");
        }
    }

    validateAutenticatedUser(user,authUser){
        if(!authUser || user.id !== authUser.id) {
            throw new UserExecption(httpStatus.FORBIDDEN, "Tou cannot see this user data.");
        }
    }

}

export default new UserService;