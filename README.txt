PORTAFOLIO MARCOS PATISHTAN - VERSION FIREBASE

CAMBIOS
- Firebase Authentication para el acceso administrativo.
- Cloud Firestore para perfil, servicios, experiencia y proyectos.
- El sitio público lee el contenido de Firestore.
- El panel administra registros desde cualquier dispositivo autorizado.
- Configuración Firebase independiente del POS PTV PATHISTAN.

PASOS OBLIGATORIOS EN FIREBASE CONSOLE
1. Abre https://console.firebase.google.com/ y selecciona el proyecto portafolio-marcos-patishtan.
2. En Build > Firestore Database, crea la base de datos (modo producción).
3. En Build > Authentication > Sign-in method, habilita Email/Password.
4. En Authentication > Users, agrega el correo y contraseña que usarás como administrador.
5. En Firestore Database > Rules, pega el contenido de firestore.rules y pulsa Publish.
6. Registra la aplicación web y confirma que los valores de configuración coinciden con js/firebase.js.
7. Publica toda la carpeta en un hosting con HTTPS o ejecútala mediante un servidor local. No abras index.html/admin.html con doble clic (file://), porque los módulos ES requieren un servidor.

COLECCIONES
- profile/main: título y descripción profesional.
- services/{id}: icono, nombre y descripción.
- experience/{id}: puesto, empresa, periodo y descripción.
- projects/{id}: nombre, categoría, descripción y URL.

PRIMER INICIO
Al iniciar sesión correctamente por primera vez, el panel crea los documentos iniciales si las colecciones están vacías. Revisa y valida la información de experiencia antes de publicarla.

SEGURIDAD
- No existe usuario/contraseña de demostración en el código.
- La API key web de Firebase identifica el proyecto; no es una contraseña. La seguridad depende de Authentication y las reglas de Firestore.
- Estas reglas permiten lectura pública solo en las colecciones del portafolio y escritura a usuarios autenticados. Para una instalación de producción con varios usuarios, conviene restringir además la escritura por UID/rol.
- No compartas contraseñas ni archivos de credenciales privadas de cuentas de servicio.
- No se usa Firebase Storage en esta versión; la fotografía sigue como archivo local en assets/.

Si Firebase muestra permission-denied, revisa que publicaste las reglas y que el usuario inició sesión en Authentication.
