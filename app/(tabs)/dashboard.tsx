import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<{ level: string; recharge: string } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const fetchGroundwaterData = async () => {
      try {
        const apiUrl =
           'https://cors-anywhere.herokuapp.com/https://indiawris.gov.in/WRISAPI/api/GroundWaterLevel/GetGroundWaterLevelData';
;

        const response = await axios.get(apiUrl, {
          params: {
            stateName: "Odisha",
            districtName: "Baleshwar",
            agencyName: "CGWB",
            startdate: "2023-11-01",
            enddate: "2023-11-30", // smaller range to avoid timeout
            download: false,
            page: 0,
            size: 10,
          },
          headers: { Accept: "application/json" },
          timeout: 30000,
        });

        console.log("✅ API Response:", response.data);

        const groundwaterData = response.data?.data?.[0] || {
          level: "N/A",
          recharge: "N/A",
        };

        setData({
          level: groundwaterData.level?.toString() || "N/A",
          recharge: groundwaterData.recharge?.toString() || "N/A",
        });
      } catch (error) {
        console.error("❌ API Error:", error);
        setData({ level: "N/A", recharge: "N/A" });
      } finally {
        setLoading(false);
      }
    };

    fetchGroundwaterData();
  }, []);

  const theme = darkMode ? darkTheme : lightTheme;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Groundwater Dashboard</Text>
        <TouchableOpacity
          onPress={() => setDarkMode(!darkMode)}
          style={[styles.toggle, { backgroundColor: theme.accent }]}
        >
          <Text style={styles.toggleText}>{darkMode ? "☀" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: 10 }] }}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>📊 Water Level</Text>
          <Text style={[styles.value, { color: theme.accent }]}>{data?.level} m</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>💧 Recharge Rate</Text>
          <Text style={[styles.value, { color: theme.accent }]}>{data?.recharge} mm/day</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const lightTheme = { background: "#F5F9FF", card: "#fff", text: "#1E2A38", accent: "#007AFF" };
const darkTheme = { background: "#121212", card: "#1E1E1E", text: "#EAEAEA", accent: "#4DA6FF" };

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  toggle: { padding: 10, borderRadius: 20 },
  toggleText: { fontSize: 18, color: "#fff" },
  card: { padding: 18, borderRadius: 14, marginBottom: 15, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 20, fontWeight: "bold", marginTop: 6 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
});
