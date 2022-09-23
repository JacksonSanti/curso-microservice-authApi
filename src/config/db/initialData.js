import bcrypt from "bcrypt";
import User from "../../module/user/model/User.js"

export async function createInitialData(){
    try {
        await User.sync({force:true});

    let passwordNew = await bcrypt.hash('password123',10);

    await User.create({
        name: "User test",
        email: "testuser@gmail.com",
        password: passwordNew,

    });
    } catch (err) {
        console.log(err);
    }
    
}