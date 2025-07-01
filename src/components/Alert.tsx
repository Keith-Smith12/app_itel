import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number; // em ms
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  visible,
  onClose,
  duration = 3000,
}) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      if (duration && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, styles[type], { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: 16,
    padding: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  success: {
    backgroundColor: '#34C759',
  },
  error: {
    backgroundColor: '#FF3B30',
  },
  warning: {
    backgroundColor: '#FF9500',
  },
  info: {
    backgroundColor: '#007AFF',
  },
});