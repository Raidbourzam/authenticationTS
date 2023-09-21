import { Request, Response} from 'express';
import User from '../models/userModels';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const ROUND : string | number = process.env.KEY_ROUND as string || 10;

const jwtSecret : string = process.env.JWT_SECRET as string || '1VSDQ44BR6ER6486T1E61QNT6NT46N84Q';

console.log('ROUND is ' + ROUND);

interface RequestBody {
    email: string;
    password: string;
}

interface JwtOptions {
    expiresIn: string | number;
}

export const register = async(req:Request , resp:Response) => {
    
    const {email,password} : RequestBody = req.body;

    if(!email){
        resp.status(400).send({message: 'Please enter an email address'});
        console.log('email is required');
    }

    if(!password){
        resp.status(400).send({message: 'Please enter a password'});
        console.log('password is required');
    }

    const newPassword = await bcrypt.hash(password,10);

    const findUser = await User.find({email: email});

    if (findUser.length > 0) {
        resp.status(400).send({message : 'email already in use'});
        return;
    }
    const jwtOptions : JwtOptions = {
        expiresIn : '1h',
    }

    const token = jwt.sign({email: email},jwtSecret,jwtOptions);

    console.log(token);

    const newUser = new User({
        email: email,
        password: newPassword,
        isAdmin: false,
        havePicture: false,
        userToken: token,
        timeCreateToken : Date.now()
    })

    try {
        await newUser.save();
        resp.cookie('token',token,{ httpOnly: true , secure: true });
        resp.status(200).send({message: `the ${newUser.email} is connected successfully`});
        console.log('User saved');
    } catch (error) {
        resp.status(400).send({message : 'error saving user'});
        console.log('Error saving' + error);
    }
}



export const login = async(req:Request , resp: Response) => {

    const {email, password} : RequestBody = req.body;

    if(!email){
        resp.status(400).send({message: 'Please enter an email address'});
        console.log('email is required');
    }

    if(!password){
        resp.status(400).send({message: 'Please enter a password'});
        console.log('password is required');
    }

    let newUser = await User.find({email: email});

    const hashPassword = await bcrypt.compare(password, newUser[0].password);

    if(hashPassword){
        const jwtOptions : JwtOptions = {
            expiresIn : 10000,
        }
        const token = jwt.sign({email: email},jwtSecret,jwtOptions);
        const updateUser = await User.findOneAndUpdate({email: email},{userToken: token, timeCreateToken: Date.now()},{new : true});
        console.log(updateUser);
        resp.cookie('token',token,{ httpOnly: true , secure: true});
        resp.status(200).send({message: 'user exists'})
    }else{
        resp.status(200).send({message: 'password does not match'});
    } 

    
}



