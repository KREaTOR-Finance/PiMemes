import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { tw } from "nativewind";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-[#111111] justify-center items-center p-6`}>
      <View style={tw`w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-600/30 to-purple-900/30 flex items-center justify-center`}>
        <Text style={tw`text-[#FFD700] text-4xl font-bold`}>π</Text>
      </View>
      
      <Text style={tw`text-3xl text-[#FFD700] font-bold text-center mb-4`}>
        Welcome to PiMemes
      </Text>
      
      <Text style={tw`text-gray-300 text-center mb-6 text-lg`}>
        Create, trade, and manage meme tokens in a decentralized way on the Pi Network.
      </Text>
      
      <View style={tw`bg-[#1a1a1a] p-6 rounded-xl mb-8 w-full`}>
        <Text style={tw`text-[#FFD700] font-bold mb-2`}>What you can do:</Text>
        <View style={tw`space-y-2`}>
          <Text style={tw`text-gray-300`}>• Create your own meme tokens</Text>
          <Text style={tw`text-gray-300`}>• Trade tokens with other users</Text>
          <Text style={tw`text-gray-300`}>• Provide liquidity and earn rewards</Text>
          <Text style={tw`text-gray-300`}>• Farm tokens for additional yields</Text>
        </View>
      </View>
      
      <Text style={tw`text-xs text-gray-400 text-center italic mb-8 px-4`}>
        Disclaimer: This is a simulated environment. PiMemes does not provide real financial transactions.
        All transactions are conducted using the Pi Network's testnet.
      </Text>
      
      <TouchableOpacity 
        style={tw`bg-[#FFD700] px-8 py-4 rounded-xl shadow-lg`} 
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={tw`text-black font-bold text-lg`}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
} 