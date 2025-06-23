import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  variant?: 'default' | 'large';
  backgroundColor?: string;
  onMenuPress?: () => void;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  variant = 'default',
  backgroundColor = '#fff',
  onMenuPress
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top, backgroundColor }
    ]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent
      />

      <View style={[
        styles.content,
        variant === 'large' && styles.contentLarge
      ]}>
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
          ) : onMenuPress && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.buttonText}>☰</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[
          styles.titleContainer,
          variant === 'large' && styles.titleContainerLarge
        ]}>
          <Text style={[
            styles.title,
            variant === 'large' && styles.titleLarge
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={styles.rightButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  contentLarge: {
    minHeight: 96,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  leftContainer: {
    minWidth: 32,
    alignItems: 'flex-start',
  },
  rightContainer: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainerLarge: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  titleLarge: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  backButton: {
    marginLeft: -8,
  },
  menuButton: {
    marginLeft: -4,
  },
  rightButton: {
    marginRight: -8,
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
  }
});