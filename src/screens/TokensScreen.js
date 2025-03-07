import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { tw } from "nativewind";
import { ChevronUpIcon, ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { fetchTokens } from "../services/api";

export default function TokensScreen() {
  const [tokens, setTokens] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const data = await fetchTokens();
      setTokens(data);
    } catch (error) {
      console.error("Error loading tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTokens();
    setRefreshing(false);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredTokens = tokens
    .filter((token) => 
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return modifier * a.name.localeCompare(b.name);
      } else if (sortBy === "supply") {
        return modifier * (a.totalSupply - b.totalSupply);
      } else if (sortBy === "liquidity") {
        return modifier * (a.initialLiquidity - b.initialLiquidity);
      }
      return 0;
    });

  const SortButton = ({ field, label }) => (
    <TouchableOpacity 
      style={tw`flex-row items-center bg-[#1a1a1a] px-3 py-2 rounded-lg ${sortBy === field ? 'border border-[#FFD700]' : ''}`}
      onPress={() => toggleSort(field)}
    >
      <Text style={tw`text-gray-300 mr-1`}>{label}</Text>
      {sortBy === field && (
        sortOrder === "asc" ? 
          <ChevronUpIcon size={16} color="#FFD700" /> : 
          <ChevronDownIcon size={16} color="#FFD700" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-[#111111] p-4`}>
      <View style={tw`flex-row items-center justify-between mb-6`}>
        <Text style={tw`text-2xl text-[#FFD700] font-bold`}>All Tokens</Text>
        <TouchableOpacity 
          style={tw`p-2 rounded-lg bg-[#1a1a1a]`}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <ArrowPathIcon size={20} color="#FFD700" style={refreshing ? tw`animate-spin` : {}} />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={tw`bg-[#1a1a1a] text-gray-300 p-4 rounded-xl mb-4 border border-purple-700/30`}
        placeholder="Search by name or symbol..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />
      
      <View style={tw`flex-row justify-between mb-4 space-x-2`}>
        <SortButton field="name" label="Name" />
        <SortButton field="supply" label="Supply" />
        <SortButton field="liquidity" label="Liquidity" />
      </View>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <FlatList
          data={filteredTokens}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <View style={tw`bg-[#1a1a1a] p-4 rounded-xl mb-3 border border-purple-700/30`}>
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/50 to-purple-900/50 flex items-center justify-center mr-3`}>
                  <Text style={tw`text-[#FFD700] font-bold text-lg`}>
                    {item.symbol.charAt(0)}
                  </Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[#FFD700] font-bold text-lg`}>{item.name}</Text>
                  <Text style={tw`text-gray-400`}>{item.symbol}</Text>
                </View>
              </View>
              
              <View style={tw`flex-row justify-between mt-2 pt-2 border-t border-purple-700/30`}>
                <View>
                  <Text style={tw`text-gray-400 text-sm`}>Supply</Text>
                  <Text style={tw`text-gray-300`}>
                    {item.totalSupply.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-gray-400 text-sm`}>Liquidity</Text>
                  <Text style={tw`text-gray-300`}>
                    {item.initialLiquidity} Pi
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-gray-400 text-sm`}>Price</Text>
                  <Text style={tw`text-gray-300`}>
                    {item.initialPrice} Pi
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={tw`flex-1 justify-center items-center py-8`}>
              <Text style={tw`text-gray-400 text-lg`}>No tokens found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
} 