const fs = require('fs');
const path = require('path');

// Función para verificar si una variable de entorno existe
function checkEnvVar(name) {
  if (!process.env[name]) {
    console.warn(`⚠️ La variable de entorno ${name} no está definida`);
    return false;
  }
  return true;
}

// Función para crear un archivo a partir de una variable de entorno en base64
function createFileFromEnvVar(envVarName, filePath) {
  if (!checkEnvVar(envVarName)) return false;
  
  try {
    // Asegúrate de que el directorio existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Decodificar la variable de entorno (base64) y escribir al archivo
    const fileContent = Buffer.from(process.env[envVarName], 'base64');
    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ Archivo creado exitosamente: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al crear el archivo ${filePath}:`, error);
    return false;
  }
}

// Crear google-services.json para Android
const androidSuccess = createFileFromEnvVar(
  'GOOGLE_SERVICES_JSON',
  path.resolve(__dirname, 'google-services.json')
);

// Crear GoogleService-Info.plist para iOS
const iosSuccess = createFileFromEnvVar(
  'GOOGLE_SERVICE_INFO_PLIST',
  path.resolve(__dirname, 'GoogleService-Info.plist')
);

// Salir con un código de error si algún archivo no se pudo crear
if (!androidSuccess || !iosSuccess) {
  console.error('❌ No se pudieron crear todos los archivos de configuración');
  process.exit(1);
}

console.log('✅ Todos los archivos de configuración creados correctamente');
