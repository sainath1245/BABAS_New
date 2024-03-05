import NetInfo from "@react-native-community/netinfo";

// This function is to check internet availabe or not 
export default class NetworkUtils {
    static async isNetworkAvailable() {
        const response = await NetInfo.fetch();
        return response.isConnected;
    }
}