const { User }=require("../models")
const { signToken, AuthenticationError }=require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent,args, context) =>{
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id}).select('-__V -password')
                return userData
            }
            throw AuthenticationError
        }
    },
    Mutation: {
        addUser: async (parent, args)=> {
            const user=await User.create(args)
            const token = signToken(user)
            return { token, user }
        },
        login: async (parent, {email,password })=> {
            const user= await User.findOne({ email })
            if(!user){
                throw AuthenticationError
            }

            const rightPw = await user.isCorrectPassword(password)
            if(!rightPw){
                throw AuthenticationError
            }
            const token = signToken(user)
            return {token, user}
        },
        saveBook: async (parent, { bookData }, context)=> {
            console.log(bookData, context.user)
            if(context.user){
                 const user = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: { savedBooks: bookData}},
                    {new: true}
                )
                return user
            }
            throw AuthenticationError
        },
        removeBook: async (parent, {bookId}, context)=> {
            if (context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedbooks:bookId}},
                    {new: true}
                )
                return updatedUser
            }
            throw AuthenticationError
        }
    },
    
}
module.exports = resolvers