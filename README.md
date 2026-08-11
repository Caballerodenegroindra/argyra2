# Argyra Community Support

Plataforma de apoyo y acompañamiento a administradores de grupos y comunidades.
Los administradores solicitan apoyo, el equipo de Argyra los verifica por WhatsApp y
después reciben un plan de mejora con seguimiento del progreso.

Áreas de acompañamiento: administración, organización, crecimiento, diseño,
automatización, moderación y actividades.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript (modo estricto) |
| Estilos | Tailwind CSS 4 |
| Autenticación | Firebase Authentication (correo y contraseña) |
| Base de datos | Cloud Firestore |
| Archivos | Firebase Storage |
| Despliegue | Firebase Hosting (frameworks backend) |
| Formularios | React Hook Form + Zod |

---

## Estructura

```
argyra/
├── src/
│   ├── app/                 Rutas del App Router
│   │   ├── solicitar/       Paso 1: reglas y permisos
│   │   │   └── programa/    Paso 2: información del programa
│   │   ├── registro/        Paso 3: alta de usuario y comunidad
│   │   ├── solicitud-enviada/  Confirmación y grupo de WhatsApp
│   │   ├── lista-de-espera/ Lista pública de comunidades
│   │   ├── ingresar/        Acceso y recuperación de contraseña
│   │   ├── panel/           Panel del usuario
│   │   │   └── mejoras/     Selección única de áreas
│   │   ├── admin/           Panel privado (usuarios, comunidades, mejoras)
│   │   └── api/session/     Cookie de sesión verificada con Admin SDK
│   ├── components/          Botones, tarjetas, estados, progreso, campos
│   ├── layouts/             Cabecera, navegación móvil, pie, marco de panel
│   ├── contexts/            AuthContext (cuenta + perfil en vivo)
│   ├── hooks/               useAuth, useRequireAuth, useCommunity
│   ├── services/            Acceso a Firestore por colección
│   ├── firebase/            Configuración del SDK cliente y Admin
│   ├── lib/                 Validación, utilidades, sesión de servidor
│   ├── types/               Modelos y etiquetas de estado
│   └── styles/              Tokens de diseño y base de Tailwind
├── scripts/                 Utilidades (crear el primer administrador)
├── .github/workflows/       CI: tipos, lint y compilación
├── docs/                    Documentación técnica
├── firestore.rules          Reglas de seguridad de Firestore
├── storage.rules            Reglas de seguridad de Storage
├── firebase.json            Hosting, Firestore, Storage y emuladores
└── package.json
```

---

## Puesta en marcha

### 1. Requisitos

- Node.js 20 o superior
- Firebase CLI: `npm install -g firebase-tools`

### 2. Instalar

```bash
git clone https://github.com/<tu-usuario>/argyra.git
cd argyra
npm install
```

### 3. Crear el proyecto en Firebase

1. Entra en la [consola de Firebase](https://console.firebase.google.com) y crea el proyecto.
2. Activa **Authentication → Sign-in method → Correo electrónico/contraseña**.
3. Crea la base de datos en **Firestore** (modo producción).
4. Activa **Storage**.
5. En **Configuración del proyecto → Tus apps**, registra una app web y copia las credenciales.
6. En **Configuración del proyecto → Cuentas de servicio**, genera una clave privada nueva
   para el Admin SDK.

### 4. Variables de entorno

```bash
cp .env.example .env.local
```

Completa `.env.local` con los valores del paso anterior. La clave privada del Admin SDK
va entre comillas y conservando los `\n`:

```
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

`.env.local` está en `.gitignore` y nunca debe subirse al repositorio.

### 5. Desarrollo

```bash
npm run dev          # http://localhost:3000
npm run typecheck    # verificación de tipos
npm run lint
```

Cada push a `main` y cada pull request ejecutan tipos, lint y compilación en GitHub
Actions. Carga las variables `NEXT_PUBLIC_*` como secretos del repositorio para que la
compilación pase.

Para trabajar sin tocar los datos reales, pon
`NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` y ejecuta `npm run emulators`.

---

## Despliegue

```bash
firebase login
firebase use --add          # asocia el ID de tu proyecto
npm run deploy:rules        # publica reglas de Firestore y Storage
npm run deploy              # compila y publica en Firebase Hosting
```

Firebase Hosting detecta Next.js y crea el backend automáticamente. Las variables del
Admin SDK deben cargarse como secretos del backend:

```bash
firebase functions:secrets:set FIREBASE_ADMIN_PRIVATE_KEY
```

---

## Modelo de datos

**users**

```json
{ "uid": "", "nick": "", "email": "", "whatsapp": "", "role": "user", "status": "pending", "createdAt": "" }
```

**communities**

```json
{ "ownerUid": "", "communityName": "", "isAdminVerified": false, "status": "waiting", "selectedImprovements": [], "createdAt": "" }
```

**requests**

```json
{ "userId": "", "communityId": "", "status": "pending", "notes": "", "createdAt": "" }
```

**improvements**

```json
{ "communityId": "", "title": "", "description": "", "progress": 0, "status": "pending", "assignedTo": "" }
```

`communities` guarda además `ownerNick` y `progress`. Son copias: la lista de espera es
pública y no puede leer los usuarios ni las tareas de otros, así que el nick y el avance
viajan dentro del documento de la comunidad. `progress` se recalcula solo cada vez que
el equipo mueve una tarea.

Los comentarios de los líderes hacia el solicitante se guardan en `requests.notes` y
aparecen en el panel del usuario en tiempo real.

Estados de usuario: `pending`, `approved`, `rejected`, `suspended`.
Estados de comunidad: `waiting`, `verifying`, `approved`, `in_progress`, `completed`.

---

## Seguridad

- **Roles**: el campo `role` del documento del usuario decide el acceso al panel privado.
- **Middleware**: `src/middleware.ts` bloquea `/panel` y `/admin` sin cookie de sesión.
- **Verificación en servidor**: `/admin` revalida el rol con el Admin SDK antes de renderizar.
- **Firestore Rules**: nadie puede escribir su propio `role` ni su propio `status`, y la
  selección de mejoras solo se acepta si el arreglo estaba vacío. Así la regla de
  "una sola vez" se cumple aunque alguien llame a la API directamente.
- **Validación doble**: Zod en el formulario y condiciones equivalentes en las reglas.
- **Storage**: las imágenes se limitan a 3 MB y a tipos `image/*`, tanto en el cliente
  como en `storage.rules`.

### Crear el primer administrador

Regístrate por la aplicación y después ejecuta:

```bash
npm run admin -- tu@correo.com
```

El script usa el Admin SDK con las credenciales de `.env.local`. Si prefieres hacerlo
a mano, cambia en Firestore `users/{tu-uid}` → `role: "admin"`, `status: "approved"`.

---

## Diseño

Mobile first. Paleta de gris metálico sobre carbón con un único acento azul-violeta
para todo lo accionable; tipografías Bricolage Grotesque (títulos), IBM Plex Sans
(texto) e IBM Plex Mono (estados y cifras). Los tokens viven en
`src/styles/globals.css`. Probado en Android, iPhone, tablet y escritorio.

---

## Licencia

Proyecto privado de Argyra. Todos los derechos reservados.
