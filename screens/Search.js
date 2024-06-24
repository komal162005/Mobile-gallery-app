import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import Icon from "@expo/vector-icons/Feather";
import axios from "axios";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImage = async (searchQuery) => {
    try {
      const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s&text=${searchQuery}`;
      const response = await axios.get(url);
      const data = response.data;

      if (data.photos) {
        const photos = data.photos.photo;
        const imageUrls = photos.map((photo) => photo.url_s);
        return imageUrls;
      } else {
        console.log("No photos found.");
        return [];
      }
    } catch (err) {
      setError(err);
      return [];
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    const urls = await searchImage(searchQuery);
    setImageUrls(urls);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Search Here</Text>
      </View>
      <View style={styles.searchBar}>
        <Searchbar
          placeholder="search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={imageUrls}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          style={styles.flatList}
          numColumns={2}
        />
      )}
      {error && (
        <Text style={styles.errorText}>
          Error fetching images. Please try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  text: {
    marginTop: 40,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "500",
  },
  icon: {
    marginLeft: 10,
  },
  searchBar: {
    margin: 20,
  },
  button: {
    backgroundColor: "#f4978e",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    margin: 10,
  },
  flatList: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
