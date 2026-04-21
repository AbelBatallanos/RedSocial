import * as SecureStore from 'expo-secure-store';

// ==========================================
// CONFIGURACIÓN: Reemplaza con la IP de tu PC
// ==========================================
export const API_URL = 'http://192.168.1.12:8000/api'; 

// Ayudante para obtener el token guardado
export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};

// Ayudante para logout
export const logout = async () => {
  await SecureStore.deleteItemAsync('userToken');
};

// ==========================================
// 1. USUARIOS
// ==========================================

export const loginUsuario = async (correo: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (response.ok) {
      await SecureStore.setItemAsync('userToken', data.access);
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Error login:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

export const registrarUsuario = async (correo: string, nombreUsuario: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append('correo', correo);
    formData.append('nombre_usuario', nombreUsuario);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/usuarios/register/`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      if (data.access) {
        await SecureStore.setItemAsync('userToken', data.access);
      }
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Error registro:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

// ==========================================
// 2. RECOMENDACIONES
// ==========================================

export const getMisRecomendaciones = async () => {
  const token = await getAuthToken();
  try {
    const response = await fetch(`${API_URL}/recomendaciones/mis-recomendaciones/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const crearRecomendacion = async (titulo: string, contenido: string, metadata: any = {}) => {
  const token = await getAuthToken();
  try {
    const response = await fetch(`${API_URL}/recomendaciones/crear/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ titulo, contenido, ...metadata })
    });
    return await response.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

// ==========================================
// 3. AMISTADES
// ==========================================

export const getAmigos = async () => {
  const token = await getAuthToken();
  try {
    const response = await fetch(`${API_URL}/amistades/obtener-amistades/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};
