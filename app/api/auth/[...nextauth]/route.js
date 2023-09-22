import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"

import connectToDB from "@utils/database";

import User from "@models/user";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    async session({ session }){
        const sessionUser = await User.findOne({
            email: session.user.email
        })

        session.user.id = sessionUser._id.toString();

        return session;
    },

    async singIn({ profile }){
        try {
            // Serverless -> lambda : dynamodb
            await connectToDB();

            //check if the user is already exists
            const userExists = await User.findOne({
                email: profile.email
            })

            //if not, create new User
            if(!userExists){
                User.create({
                    email: profile.email,
                    username: profile.username.replace(" ", "").toLowerCase(),
                    image: profile.picture
                })
            }

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
})

export { handler as GET, handler as POST}