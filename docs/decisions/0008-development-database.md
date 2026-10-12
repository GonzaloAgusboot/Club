# 0008 - Base de desarrollo: Supabase en la nube (plan gratuito), sin Docker

**Estado:** Aceptada

## Contexto

Supabase local requiere Docker, que no está instalado. Instalarlo consume
bastante RAM y espacio. El plan gratuito de Supabase en la nube alcanza para
desarrollo.

## Decisión

- El desarrollo usa **un proyecto Supabase en la nube con el plan gratuito**,
  dedicado exclusivamente a desarrollo. No se instala Docker por ahora.
- El **esquema vive en Git** como migraciones SQL (`supabase/migrations/`),
  nunca se arma "a mano" desde el panel web. Así la base se puede recrear.
- Los datos de desarrollo son **ficticios** y reproducibles (semillas). No se
  cargan datos personales reales.
- Las claves van solo en `.env.local` (ignorado por Git). Ver
  [la guía de configuración](../setup/supabase.md).
- El proyecto de desarrollo no se reutiliza como producción. Producción será
  otro proyecto, con su plan, sus claves y sus backups.

## Consecuencias

- Menos instalación local y arranque más rápido.
- Hace falta internet para desarrollar y probar la base; los tests de RLS
  corren contra la base de desarrollo real (que es lo que da confianza).
- El plan gratuito pausa proyectos inactivos y **no ofrece backups
  descargables**: está bien para desarrollo, no para producción. Al llegar a
  producción habrá que contratar un plan con backups (decisión a aprobar en su
  momento).
- Si más adelante se instala Docker, se puede pasar a Supabase local sin
  cambiar el esquema, porque las migraciones ya están en el repositorio.
