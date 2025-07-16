import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QrCode, Camera as CameraIcon, Zap, ZapOff } from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, signIn } = useAuth();
  const { data: user } = useUser();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For now, we'll simulate camera permission
    setHasPermission(true);
  }, []);

  const handleQRCodeScan = async (qrData) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      // Parse QR code data - expecting format: {"employee_id": 1, "member_code": "Abd-1", "action": "clock"}
      const data = JSON.parse(qrData);

      if (!data.employee_id || !data.member_code) {
        Alert.alert(
          "Invalid QR Code",
          "This QR code is not valid for time tracking",
        );
        setScanned(false);
        setLoading(false);
        return;
      }

      // Determine action based on current status
      const response = await fetch(
        `/api/time-entries?employee_id=${data.employee_id}&date=${new Date().toISOString().split("T")[0]}`,
      );
      const entries = await response.json();

      const activeEntry = entries.find((entry) => !entry.clock_out_time);
      const action = activeEntry ? "out" : "in";

      // Perform clock action
      const endpoint =
        action === "in" ? "/api/time-entries" : "/api/time-entries/clock-out";

      const clockResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: data.employee_id,
          member_code: data.member_code,
        }),
      });

      if (clockResponse.ok) {
        const result = await clockResponse.json();
        Alert.alert(
          "Success!",
          `Employee ${data.member_code} clocked ${action} successfully at ${new Date().toLocaleTimeString()}`,
          [
            {
              text: "OK",
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
            },
          ],
        );
      } else {
        const error = await clockResponse.json();
        Alert.alert("Error", error.message || `Failed to clock ${action}`);
        setScanned(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert(
        "Error",
        "Invalid QR code format or network error. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
              setLoading(false);
            },
          },
        ],
      );
    }
  };

  // Simulate QR code scanning for demo
  const simulateQRScan = () => {
    const demoQRData = JSON.stringify({
      employee_id: 1,
      member_code: "Abd-1",
      action: "clock",
    });
    handleQRCodeScan(demoQRData);
  };

  if (!isAuthenticated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <QrCode color="#2563EB" size={64} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
            marginTop: 20,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          QR Scanner
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          Please sign in to access the QR scanner
        </Text>
        <TouchableOpacity
          onPress={signIn}
          style={{
            backgroundColor: "#2563EB",
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: insets.top }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingHorizontal: 20,
          paddingVertical: 16,
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
          QR Scanner
        </Text>
        <Text style={{ fontSize: 14, color: "#D1D5DB", marginTop: 4 }}>
          Scan QR code to clock in/out
        </Text>
      </View>

      {/* Camera Simulation View */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1F2937",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Scanning Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Top overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          {/* Bottom overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          {/* Left overlay */}
          <View
            style={{
              position: "absolute",
              top: "30%",
              left: 0,
              width: "15%",
              height: "40%",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          {/* Right overlay */}
          <View
            style={{
              position: "absolute",
              top: "30%",
              right: 0,
              width: "15%",
              height: "40%",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          {/* Scanning frame */}
          <View
            style={{
              width: 250,
              height: 250,
              borderWidth: 2,
              borderColor: "#2563EB",
              borderRadius: 12,
              backgroundColor: "transparent",
            }}
          >
            {/* Corner indicators */}
            <View
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                width: 30,
                height: 30,
                borderTopWidth: 4,
                borderLeftWidth: 4,
                borderColor: "#10B981",
                borderTopLeftRadius: 12,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 30,
                height: 30,
                borderTopWidth: 4,
                borderRightWidth: 4,
                borderColor: "#10B981",
                borderTopRightRadius: 12,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -2,
                left: -2,
                width: 30,
                height: 30,
                borderBottomWidth: 4,
                borderLeftWidth: 4,
                borderColor: "#10B981",
                borderBottomLeftRadius: 12,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 30,
                height: 30,
                borderBottomWidth: 4,
                borderRightWidth: 4,
                borderColor: "#10B981",
                borderBottomRightRadius: 12,
              }}
            />
          </View>

          {/* Instructions */}
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "500",
              marginTop: 30,
              textAlign: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            {loading ? "Processing..." : "Position QR code within the frame"}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 40,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Flash toggle */}
        <TouchableOpacity
          onPress={() => setFlashOn(!flashOn)}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: flashOn ? "#F59E0B" : "rgba(255,255,255,0.3)",
          }}
        >
          {flashOn ? (
            <Zap color="#F59E0B" size={24} />
          ) : (
            <ZapOff color="white" size={24} />
          )}
        </TouchableOpacity>

        {/* Demo scan button */}
        <TouchableOpacity
          onPress={simulateQRScan}
          disabled={loading}
          style={{
            backgroundColor: "#2563EB",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            {loading ? "Processing..." : "Demo Scan"}
          </Text>
        </TouchableOpacity>

        {/* Reset scan button */}
        {scanned && (
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              setLoading(false);
            }}
            style={{
              backgroundColor: "#10B981",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Scan Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
