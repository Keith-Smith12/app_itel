import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'house.fill', label: 'Início', route: '/(app)/home' },
  { icon: 'doc.text.fill', label: 'Notas', route: '/(app)/note' },
  { icon: 'calendar', label: 'Calendário', route: '/(app)/calendar' },
  { icon: 'person.fill', label: 'Perfil', route: '/(app)/profile' },
  { icon: 'gearshape.fill', label: 'Configurações', route: '/(app)/settings' },
];

export function Drawer({ isVisible, onClose }: DrawerProps) {
  const insets = useSafeAreaInsets();
  const [animation] = React.useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.75;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route);
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none">
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.container}>
        <Animated.View
          style={[styles.backdrop, { opacity }]}
          onTouchEnd={onClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX }],
              width: drawerWidth,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>ITEL</Text>
          </View>

          <View style={styles.menuItems}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <SymbolView
                  name={item.icon}
                  size={24}
                  weight="medium"
                  tintColor="#007AFF"
                />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={() => {
              onClose();
              router.push('/login');
            }}
          >
            <SymbolView
              name="rectangle.portrait.and.arrow.right"
              size={24}
              weight="medium"
              tintColor="#FF3B30"
            />
            <Text style={[styles.menuItemText, styles.logoutText]}>
              Sair
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuItems: {
    flex: 1,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 16,
    marginHorizontal: 8,
  },
  logoutText: {
    color: '#FF3B30',
  },
});