import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
// Importamos las funciones limpias que acabamos de arreglar
import { obtenerTodosLosUsuarios, enviarSolicitudAmistad, obtenerMisAmigos } from '../src/services/api';
import { useAuthContext } from '../src/context/AuthContext';
import { Avatar } from '../src/components/ui/Avatar';
import { COLORS, SIZES } from '../src/styles/theme';

export default function AllUsersScreen() {
  const { token, user: currentUser } = useAuthContext();
  const [users, setUsers] = useState<any[]>([]);
  const [amistades, setAmistades] = useState<any[]>([]); // Guardamos las relaciones reales

  // Usamos un solo estado para forzar la recarga visual cuando agregamos a alguien
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  useEffect(() => {
    const cargarDatos = async () => {
      if (!token || !currentUser?.id) return;

      try {
        // Ejecutamos ambas peticiones al mismo tiempo para que sea más rápido
        const [todosLosUsuarios, misAmistades] = await Promise.all([
          obtenerTodosLosUsuarios(token),
          obtenerMisAmigos(token)
        ]);

        // Filtramos para no verte a ti mismo usando el ID
        const filtrados = (todosLosUsuarios || []).filter((u: any) => u.id !== currentUser.id);
        
        setUsers(filtrados);
        setAmistades(misAmistades || []);

      } catch (error) {
        console.log("Error cargando usuarios", error);
      }
    };

    cargarDatos();
  }, [token, currentUser, refreshTrigger]); // Se recarga si cambia el trigger

  const handleFollow = async (amigoId: string) => {
    const res = await enviarSolicitudAmistad(token!, amigoId);
    
    if (res.message || res.amistad) {
      Alert.alert("Éxito", "Solicitud enviada.");
      // Forzamos a que el useEffect vuelva a consultar la DB para actualizar los botones
      setRefreshTrigger(prev => prev + 1); 
    } else {
      Alert.alert("Aviso", res.error || "No se pudo enviar");
    }
  };

  // Función para determinar el estado de la relación con un usuario específico
  const obtenerEstadoAmistad = (userId: string) => {
    // Buscamos si existe una relación en la lista de amistades donde participe este usuario
    const relacion = amistades.find(a => a.usuario?.id === userId || a.amigo?.id === userId);
    return relacion ? relacion.estado : 'none'; // 'pending', 'accepted', o 'none'
  };

  return (
    <View style={styles.container}>
      {/* Header con flecha de retroceso nativa */}
      <Stack.Screen 
        options={{ 
          title: 'Descubrir personas', 
          headerShown: true, 
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.textPrimary,
          headerShadowVisible: false 
        }} 
      />
      
      <FlatList 
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.md }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          
          // Verificamos el estado real en la base de datos
          const estado = obtenerEstadoAmistad(item.id);
          const isPending = estado === 'pending';
          const isFriend = estado === 'accepted';

          return (
            <View style={styles.userItem}>
              <Avatar name={item.nombre_usuario} source={item.avatar} size={50} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>@{item.nombre_usuario}</Text>
                <Text style={styles.userBio} numberOfLines={1}>
                  {item.biografia || 'Sin biografía'}
                </Text>
              </View>
              
              {/* Botón dinámico según el estado */}
              <TouchableOpacity 
                style={[
                  styles.btn, 
                  isPending && styles.btnPending,
                  isFriend && styles.btnFriend
                ]}
                onPress={() => handleFollow(item.id)}
                disabled={isPending || isFriend} // Desactivamos si ya es amigo o está pendiente
              >
                <Text style={[
                  styles.btnText, 
                  isPending && styles.btnTextPending,
                  isFriend && styles.btnTextFriend
                ]}>
                  {isFriend ? 'Amigos' : isPending ? 'Pendiente' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios para mostrar.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  userItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    backgroundColor: COLORS.surface, 
    padding: 12, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 16 },
  userBio: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  
  // Botón Normal (Seguir)
  btn: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  btnText: { color: COLORS.surface, fontWeight: '900', fontSize: 13 },
  
  // Botón Pendiente
  btnPending: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border },
  btnTextPending: { color: COLORS.textSecondary },

  // Botón Amigo
  btnFriend: { backgroundColor: COLORS.surfaceAlt, borderWidth: 0 },
  btnTextFriend: { color: COLORS.textPrimary },

  emptyText: { color: COLORS.textTertiary, textAlign: 'center', marginTop: 40 }
});