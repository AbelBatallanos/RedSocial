# RED_SOCIAL - Backend API


## 🛠️ Requisitos Previos

Antes de comenzar, tener instalado:
* **Docker** y **Docker Compose** (Recomendado para ejecución)
* **Python 3.12+** (Opcional, para desarrollo local/linters)
* **Git**

---

## 💻 Configuración del Entorno Virtual (Local)

```bash
# 1. Crear el entorno virtual en la carpeta .venv
python -m venv .venv

# 2. Activar el entorno virtual
# En Windows:
.venv\Scripts\activate
# En Linux/Mac:
source .venv/bin/activate

# 3. Actualizar el gestor de paquetes pip
pip install --upgrade pip

# 4. Instalar las dependencias listadas en requirements.txt
pip install -r requirements.txt


## Docker


# Detener y eliminar los contenedores del proyecto
docker-compose down

# Construye las imágenes y levanta los contenedores (App y DB)
docker-compose up --build

# 1. Detectar cambios en los modelos y generar archivos de migración
docker-compose exec tracking_friends python manage.py makemigrations

# 2. Aplicar las migraciones a la base de datos dentro de Docker
docker-compose exec tracking_friends python manage.py migrate

# Ver los logs del servidor en tiempo real para debugging
docker-compose logs -f tracking_friends

# Reiniciar solo el servicio del backend
docker-compose restart tracking_friends




