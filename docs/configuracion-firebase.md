# Configuración de Firebase

## Servicios usados

| Servicio | Para qué |
| --- | --- |
| Authentication | Alta y acceso con correo y contraseña |
| Cloud Firestore | users, communities, requests, improvements |
| Storage | Logos de comunidad y avatares |
| Hosting | Publicación de la app Next.js |

## Índices

`firestore.indexes.json` incluye los índices compuestos que necesitan las consultas
con filtro y orden (por ejemplo comunidades por estado y fecha). Se publican con:

```bash
firebase deploy --only firestore:indexes
```

## Sesión

El cliente obtiene un ID token de Firebase y lo envía a `/api/session`. El Admin SDK
lo cambia por una cookie `httpOnly` de cinco días que el middleware puede leer en el
borde. Al cerrar sesión se borra la cookie y se llama a `signOut`.

## Emuladores

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
npm run emulators
```

Auth en 9099, Firestore en 8080, Storage en 9199 y la interfaz en 4000.

## Roles

No se usan custom claims: el rol vive en `users/{uid}.role` y lo leen tanto las reglas
de Firestore como el layout de `/admin`. Si más adelante el volumen de lecturas lo
justifica, conviene migrar a custom claims para ahorrar un `get()` por regla.
