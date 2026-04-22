import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
// ⚠️ AÑADIMOS enviarSolicitudAmistad
import { obtenerTodosLosUsuarios, enviarSolicitudAmistad } from '../src/services/api';
import { useAuthContext } from '../src/context/AuthContext';
import { Avatar } from '../src/components/ui/Avatar';
import { COLORS, SIZES } from '../src/styles/theme';

interface User {
  id: string;
  nombre_usuario: string;
  avatar?: string;
  biografia?: string;
}

export default function AllUsersScreen() {
  const { token, user } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  
  // ⚠️ ESTADO PARA RASTREAR SOLICITUDES ENVIADAS
  const [requestSent, setRequestSent] = useState<string[]>([]);

  useEffect(() => {
    obtenerTodosLosUsuarios(token!).then((data) => {
      // Filtramos para que no te salgas tú mismo en la lista
      const filtrados = data.filter((u: User) => u.nombre_usuario !== user?.nombre_usuario);
      setUsers(filtrados);
    });
  }, []);

  // ⚠️ LA MISMA FUNCIÓN EXACTA QUE TIENES EN EL SEARCH
  const handleFollow = async (amigoId: string) => {
    console.log("➕ Enviando solicitud al ID:", amigoId);
    const res = await enviarSolicitudAmistad(token!, amigoId);
    
    if (res.informacion || res.id) {
      setRequestSent([...requestSent, amigoId]);
      Alert.alert("Éxito", "Solicitud enviada.");
    } else {
      console.log("⚠️ Error al seguir:", res);
      Alert.alert("Aviso", res.error || "No se pudo enviar");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Descubrir personas', headerTintColor: COLORS.textPrimary }} />
      <FlatList 
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.md }}
        renderItem={({ item }) => {
          
          // Comprobamos si a este usuario ya le dimos "Seguir"
          const isSent = requestSent.includes(item.id);

          return (
            <View style={styles.userItem}>
              <Avatar name={item.nombre_usuario} source={item.avatar} size={50} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: COLORS.textPrimary, fontWeight: '800' }}>@{item.nombre_usuario}</Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>{item.biografia || 'Sin biografía'}</Text>
              </View>
              
              {/* ⚠️ BOTÓN ACTUALIZADO CON LOS ESTADOS */}
              <TouchableOpacity 
                style={[styles.btn, isSent && styles.btnSent]}
                onPress={() => handleFollow(item.id)}
                disabled={isSent}
              >
                <Text style={[styles.btnText, isSent && styles.btnTextSent]}>
                  {isSent ? 'Pendiente' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  userItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.surface, padding: 12, borderRadius: 15 },
  
  // ESTILOS DEL BOTÓN ORIGINAL
  btn: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  btnText: { color: COLORS.surface, fontWeight: '900' },
  
  // ESTILOS DEL BOTÓN CUANDO YA SE ENVIÓ LA SOLICITUD
  btnSent: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  btnTextSent: { color: COLORS.textSecondary }
});