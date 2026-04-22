import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuthContext } from '../../../src/context/AuthContext';
import { COLORS, SIZES } from '../../../src/styles/theme';

export default function ProfileScreen() {
  const { logout } = useAuthContext(); // Extraes la función del contexto

  return (
    <TouchableOpacity 
      style={styles.logoutButton} 
      onPress={logout} // Aquí llamas a la función
    >
      <Text style={styles.logoutText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: COLORS.error || '#FF4444', // Un color rojo para indicar salida
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});