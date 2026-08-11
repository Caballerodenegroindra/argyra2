# Flujo del usuario

```
Inicio
  │  "Solicitar apoyo"
  ▼
/solicitar ─────────── Reglas y permisos + checkbox obligatorio
  │  "Continuar"
  ▼
/solicitar/programa ── Requisitos y áreas disponibles
  │  "Acepto y deseo registrarme"
  ▼
/registro ──────────── Nick, comunidad, WhatsApp, correo, contraseña
  │  crea: cuenta en Auth + users(pending) + communities(waiting) + requests(pending)
  ▼
/solicitud-enviada ─── Grupo oficial de WhatsApp + instrucciones
  │  el equipo verifica por WhatsApp
  ▼
users.status = approved   y   communities.status = verifying → approved
  │
  ▼
/panel/mejoras ─────── Selección de áreas (UNA sola vez)
  │
  ▼
/panel ─────────────── Estado, tareas, comentarios y progreso en vivo
```

## Reglas del flujo

- El usuario nace siempre como `pending`: ni el formulario ni el cliente pueden
  cambiar ese estado.
- La comunidad aparece en la lista pública recién cuando deja de estar en `waiting`.
- La selección de mejoras se acepta solo si `selectedImprovements` está vacío. Se
  valida en el servicio y otra vez en las reglas de Firestore.

## Comentarios del equipo

Cada solicitud tiene un campo `notes`. Los líderes lo editan desde
**Panel de Argyra → Comunidades**, y el texto aparece en el panel del solicitante
dentro de "Comentarios del equipo". Las reglas permiten escribirlo solo a los
administradores y leerlo solo al dueño de la solicitud.

## Progreso

`improvements.progress` es el avance de cada tarea. Al moverlo, el servicio recalcula
el promedio y lo copia a `communities.progress`, que es lo que ve la lista pública.
