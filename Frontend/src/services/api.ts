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

export const loginUsuario = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/login/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        correo: email,
        password: password 
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Si el backend te devuelve 'access', lo guardamos
      await SecureStore.setItemAsync('userToken', data.access || data.tokens?.access);
      return { success: true, data };
    } else {
      // Esto capturará el error de "This field is required" si algo sale mal
      return { success: false, error: data.correo ? data.correo[0] : 'Credenciales inválidas' };
    }
  } catch (error) {
    return { success: false, error: 'Error de conexión con el servidor' };
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
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.tokens && data.tokens.access) {
        await SecureStore.setItemAsync('userToken', data.tokens.access);
      }
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Error en el registro' };
    }
  } catch (error) {
    console.error('Error registro:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

export const obtenerTodosLosUsuarios = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/todos/`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
    });

    if (!response.ok) {
      console.log("⚠️ El servidor respondió con error:", response.status);
      return [];
    }

    const data = await response.json();
    return data.Usuarios || [];
  } catch (error) {
    console.log("❌ Error en la petición:", error);
    return [];
  }
};

// ==========================================
// 5. PERFIL DE USUARIO
// ==========================================
export const actualizarPerfil = async (
  token: string, 
  datos: { nombre_usuario?: string, biografia?: string, fecha_nacimiento?: string }, 
  imageUri?: string | null
) => {
  try {
    const formData = new FormData();
    
    if (datos.nombre_usuario) formData.append('nombre_usuario', datos.nombre_usuario);
    if (datos.biografia) formData.append('biografia', datos.biografia);
    if (datos.fecha_nacimiento) formData.append('fecha_nacimiento', datos.fecha_nacimiento);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      // @ts-ignore
      formData.append('avatar', { uri: imageUri, name: filename, type });
    }

    const response = await fetch(`${API_URL}/usuarios/miperfil/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data };
  } catch (error) {
    return { success: false, error: 'Error de red al actualizar' };
  }
};

// ==========================================
// 2. RECOMENDACIONES
// ==========================================

export const obtenerFeedGlobal = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/recomendaciones/todos/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    // Esta ruta devuelve directamente el array según tu View de Django
    return { success: response.ok, data: data };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
};

export const obtenerPosts = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/recomendaciones/mis-recomendaciones/`, { 
      // O el endpoint de feed global si lo tienes
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return response.ok ? { success: true, data: data.recomendaciones } : { success: false, error: data };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
};

export const crearRecomendacion = async (token: string, datos: any, imageUri: string | null) => {
  try {
    const formData = new FormData();
    formData.append('titulo', datos.titulo);
    formData.append('descripcion', datos.descripcion);
    formData.append('tipo', datos.tipo || 'otro');
    formData.append('visibilidad', datos.visibilidad || 'public');

    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;
      
      // @ts-ignore
      formData.append('imagen', { uri: imageUri, name: filename, type });
    }

    const response = await fetch(`${API_URL}/recomendaciones/crear/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData, 
    });

    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data };
  } catch (error) {
    return { success: false, error: 'Error de conexión al crear' };
  }
};

export const actualizarRecomendacion = async (token: string, id: string, datos: any, imageUri?: string | null) => {
  try {
    const formData = new FormData();
    if (datos.titulo) formData.append('titulo', datos.titulo);
    if (datos.descripcion) formData.append('descripcion', datos.descripcion);
    if (datos.tipo) formData.append('tipo', datos.tipo);
    if (datos.visibilidad) formData.append('visibilidad', datos.visibilidad);

    if (imageUri && !imageUri.startsWith('http')) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;
      // @ts-ignore
      formData.append('imagen', { uri: imageUri, name: filename, type });
    }

    const response = await fetch(`${API_URL}/recomendaciones/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData, 
    });

    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data };
  } catch (error) {
    return { success: false, error: 'Error al actualizar' };
  }
};

export const eliminarRecomendacion = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_URL}/recomendaciones/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 204 || response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data };
    }
  } catch (error) {
    return { success: false, error: 'Error de conexión al eliminar' };
  }
};

// ==========================================
// 3. AMISTADES
// ==========================================

// Buscar usuarios
export const buscarUsuarios = async (token: string, query: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/buscar/?q=${query}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};

// Enviar solicitud de amistad
export const enviarSolicitudAmistad = async (token: string, amigoId: string) => {
  const response = await fetch(`${API_URL}/amistades/solicitar-amistad/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amigo_id: amigoId }),
  });
  return await response.json();
};

// Obtener la lista de mis amigos y solicitudes enviadas/recibidas
export const obtenerMisAmigos = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/amistades/obtener-amistades/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.amistades || [];
  } catch (error) {
    return [];
  }
};

// Obtener solicitudes pendientes (Las que me enviaron a mí)
export const obtenerSolicitudesPendientes = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/amistades/obtener-amistades-pendientes/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data.amistades || []; 
  } catch (error) {
    return [];
  }
}

// Aceptar Amistad (Basado en la URL: aceptar-amistad/<uuid:amistad_id>/)
export const responderSolicitud = async (token: string, amistadId: string, accion: 'aceptar' | 'rechazar') => {
  const endpoint = accion === 'aceptar' ? 'aceptar-amistad' : 'rechazar-amistad';
  const response = await fetch(`${API_URL}/amistades/${endpoint}/${amistadId}/`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
};

// // Aceptar solicitud
// export const aceptarAmistad = async (token: string, amistadId: string) => {
//   const response = await fetch(`${API_URL}/amistades/aceptar-amistad/${amistadId}/`, {
//     method: 'PUT', // Tu backend usa PUT
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   return await response.json();
// };

// // Obtener notificaciones generales
// export const obtenerNotificaciones = async (token: string) => {
//   const response = await fetch(`${API_URL}/usuarios/notificaciones/`, {
//     method: 'GET',
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   const data = await response.json();
//   return response.ok ? data : [];
// };
