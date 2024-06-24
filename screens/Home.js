import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";

export default function Home() {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async (page = 1) => {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=${page}&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s`;
    try {
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
    } catch (error) {
      setError(error);
      // console.error("Error fetching images from Flickr:", error);
      return [];
    }
  };

  const loadImage = async (page = 1) => {
    try {
      const cachedImages = await AsyncStorage.getItem("cachedImages");
      if (cachedImages && page === 1) {
        setImageUrls(JSON.parse(cachedImages));
        setLoading(false);
      }
      const urls = await fetchImages(page);
      if (page === 1) {
        setImageUrls(urls);
        await AsyncStorage.setItem("cashedImages", JSON.stringify(urls));
      } else {
        setImageUrls((prevImages) => [...prevImages, ...urls]);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadImage();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadImage(1);
    setRefreshing(false);
    setLoadingMore(false);
  };

  const LoadingMoreImage = async () => {
    if (loadingMore || page >= 3) return;
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    await loadImage(page + 1);
  };

  const retry = async () => {
    setError(null);
    loadImage();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          style={styles.list}
          data={imageUrls}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={LoadingMoreImage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && page < 3 ? (
              <ActivityIndicator size="medium" color="#0000ff" />
            ) : null
          }
        />
      )}
      {error && (
        <Snackbar
          visible={!!error}
          onDismiss={() => setError(null)}
          action={{
            label: "Retry",
            onPress: retry,
          }}
        >
          Network Issue, Please retry!
        </Snackbar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 150,
    height: 150,
    margin: 10,
  },
  list: {
    margin: 10,
    alignContent: "center",
    alignSelf: "center",
  },
});
