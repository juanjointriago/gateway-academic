# 🔐 Configuración de Secretos para CI/CD

Para que el flujo de CI/CD funcione correctamente, necesitas configurar los siguientes secretos en GitHub:

## 📋 Secretos Requeridos

### 1. **EXPO_TOKEN**
- **Descripción**: Token de autenticación para EAS CLI
- **Cómo obtenerlo**:
  1. Ve a [expo.dev](https://expo.dev)
  2. Inicia sesión con tu cuenta
  3. Ve a Account Settings > Access Tokens
  4. Crea un nuevo token con permisos de build

### 2. **GOOGLE_SERVICES_JSON** 
- **Descripción**: Archivo de configuración de Firebase para Android (base64)
- **Ya configurado**: ✅ (ya lo tienes en tus secretos de EAS)

### 3. **GOOGLE_SERVICE_INFO_PLIST**
- **Descripción**: Archivo de configuración de Firebase para iOS (base64)  
- **Ya configurado**: ✅ (ya lo tienes en tus secretos de EAS)

### 4. **GOOGLE_PLAY_SERVICE_ACCOUNT**
- **Descripción**: Credenciales para subir a Google Play Store
- **Cómo obtenerlo**:
  1. Ve a [Google Play Console](https://play.google.com/console)
  2. Ve a Setup > API access
  3. Crea una nueva service account
  4. Descarga el archivo JSON
  5. Convierte el contenido a base64: `cat service-account.json | base64`

## 🚀 Configurar Secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Ve a Settings > Secrets and variables > Actions
3. Haz clic en "New repository secret"
4. Agrega cada secreto con su valor correspondiente

## 📱 Secretos Opcionales para iOS (futuro)

### 5. **APPLE_ID**
- **Descripción**: Tu Apple ID para App Store Connect
- **Ejemplo**: `developer@yourdomain.com`

### 6. **APPLE_APP_SPECIFIC_PASSWORD**
- **Descripción**: App-specific password para tu Apple ID
- **Cómo obtenerlo**:
  1. Ve a [appleid.apple.com](https://appleid.apple.com)
  2. Sign In > App-Specific Passwords
  3. Genera una nueva contraseña

### 7. **ASC_APP_ID**
- **Descripción**: App Store Connect App ID
- **Cómo obtenerlo**: Desde App Store Connect > App Information

## ✅ Verificar Configuración

Una vez configurados todos los secretos, puedes probar el flujo:

```bash
# Crear un release de prueba
npm run release:patch
```

Esto creará un tag y activará automáticamente el build y distribución.

## 🔧 Comandos Útiles

```bash
# Generar changelog manualmente
npm run changelog

# Hacer releases
npm run release:patch   # 1.0.6 -> 1.0.7
npm run release:minor   # 1.0.6 -> 1.1.0  
npm run release:major   # 1.0.6 -> 2.0.0

# Builds manuales
npm run build:android:production
npm run submit:android
```

## 🎯 Flujos Configurados

### **Push a main**
- ✅ Validación de código
- ✅ Build de producción
- ✅ Artefactos disponibles

### **Pull Request**
- ✅ Validación de código
- ✅ Build de preview
- ✅ Comentario en PR con enlaces

### **Release Tag (v*.*.*)**
- ✅ Build de producción
- ✅ Distribución a Play Store
- ✅ Creación de GitHub Release
- ✅ Changelog automático

## 🆘 Troubleshooting

Si algo falla, revisa:
1. Los logs en Actions tab
2. Que todos los secretos estén configurados
3. Que EAS esté configurado correctamente
4. Que el proyecto compile localmente

---

**💡 Tip**: Una vez configurado, cada push a main generará un build automáticamente, y cada tag de release lo distribuirá a las tiendas.
