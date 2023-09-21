import mongoose, {Document , Schema } from "mongoose"

interface IuserSchema extends Document {
    email: string,
    password: string,
    isAdmin: boolean,
    havePicture: boolean,
    userToken: string,
    timeCreateToken: string
}


const userSchema = new Schema<IuserSchema>({
    email: {type: "string", required: true , unique: true},
    password: {type: "string", required: true},
    isAdmin: {type: "boolean", required: true},
    havePicture: {type: "boolean", required: true},
    userToken: {type: "string", required: true},
    timeCreateToken: {type: "string", required: true}
},{ collection : "users"})

export default mongoose.model("user", userSchema);