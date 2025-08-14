const { StreamChat } = require("stream-chat")
require("dotenv").config();

const apikey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

const streamClient = StreamChat.getInstance(apikey, apiSecret);

const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    }
    catch (error) {
        console.log("Error upserting Stream User", error)
    }
}

const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}

module.exports = { upsertStreamUser, generateStreamToken }