import mongoose from "mongoose";

// export async function connectDB(){

//     const uri = 'mongodb+srv://amit:amit1234@amit1.zivnfv3.mongodb.net/hello';

//     try {
//         await mongoose.connect(uri);
//         const connection = mongoose.connection

//         connection.on('connected', () =>{
//             console.log('MongoDB Connected...');
//         })
//         connection.on('error', (err) => {
//             console.error(`MongoDB connection error: ${err.message}`);
//             process.exit(1);
//         });

//     } catch (error: any) {
//         console.log("MongoDB connection error:", error.message);
//         process.exit(1);
//     }
// }


const connectDB= async ()=> {
    try{
        const connectionIns= await mongoose.connect(`${process.env.MONGODB_URI}/hello`);
        console.log("*********************************************************************");
        console.log(`MongoDB Connected...!! DB HOST: ${connectionIns.connection.host}`);
    } 
    catch(error){
        console.log("MONGODB Connection Faild!!", error);
        process.exit(1);
    }
}
export {connectDB};
