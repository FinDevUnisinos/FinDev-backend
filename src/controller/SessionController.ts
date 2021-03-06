import { njwtSecret } from "../config/jwt";
import { User } from "../entity/User";
import { UserController } from "./UserController";
let nJwt = require('njwt');

export class SessionController {
    
    async getUserLoggedIn(req: any): Promise<User> {
        const userController = new UserController
        const validToken = this.validateToken(req.headers['x-access-token'].toString())
        return await userController.getUserByEmail(validToken.body.email.toString())
    }

    generateToken(name: string, email: string): any {
        var claims = {
            "name": name,
            "email": email,
            "jti": "48c1dd1c-d526-4f06-a3af-6223695e2f89",
            "iat": 1568777437,
            "exp": 1568781037
        }
        var jwt = nJwt.create(claims, njwtSecret, "HS256");
        var token = jwt.compact();

        return token
    }

    validateToken(token: string): any {
        try {
            let verifiedJwt = nJwt.verify(token, njwtSecret);
            return verifiedJwt
        } catch (e) {
            console.log("CATCH validate Token")
            console.log(e);
            return -1
        }
    }

    hashPassword(password: string): any {
        var hash = require('hash.js')
        return hash.sha256().update(password).digest('hex')
    }

}