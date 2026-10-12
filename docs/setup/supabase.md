# Crear el proyecto Supabase de desarrollo (de forma segura)

Esta guía la sigue **una persona** (no un asistente automático): crear cuentas
y manejar claves es una tarea humana. No hace falta hacerla hasta la etapa 2,
que es cuando la aplicación empieza a usar la base.

Decisión asociada: [ADR 0008](../decisions/0008-development-database.md).

## Qué es cada cosa (en simple)

- **Proyecto Supabase**: una base de datos PostgreSQL en la nube, más
  autenticación y otras herramientas, todo con una URL propia.
- **Clave publishable** (`sb_publishable_...`): se puede incluir en la parte
  pública de la app. Por sí sola no da acceso a nada: lo que se puede hacer
  con ella lo limitan las políticas RLS de cada tabla.
- **Clave secret** (`sb_secret_...`): da acceso total y **saltea RLS**. Es como
  la llave maestra del edificio. Solo vive en el servidor. Si se filtra, hay
  que rotarla de inmediato.
- Supabase todavía muestra las claves antiguas `anon` y `service_role`
  (*legacy*). Hacen lo mismo que las nuevas. En este proyecto usamos las
  nuevas (`publishable` / `secret`).

## Paso a paso

1. **Proteger tu cuenta antes de crear nada.** Si entrás con GitHub, activá la
   verificación en dos pasos en GitHub. Si usás email y contraseña, activá MFA
   en Supabase. Esta cuenta administra todos los datos del proyecto.
2. **Crear la cuenta y una organización** en <https://supabase.com> con el plan
   **Free**. Si algún paso te pide pagar o activar un plan pago, detenete: por
   ahora no se contratan servicios pagos.
3. **Crear un proyecto nuevo** con estos criterios:
   - Nombre: `club-dev` (el sufijo `-dev` evita confundirlo con producción).
   - Contraseña de la base de datos: generala con un gestor de contraseñas
     (larga y aleatoria) y guardala ahí. **No la pegues en archivos del
     repositorio ni en chats.** Por ahora la aplicación no la necesita.
   - Región: la más cercana disponible. Para Argentina suele ser
     `South America (São Paulo)`.
4. **Buscar los valores** en el panel del proyecto, en *Project Settings*:
   - La **URL del proyecto** (sección API / Data API).
   - La **publishable key** y la **secret key** (sección *API Keys*).
   Los nombres exactos de los menús pueden variar un poco; si no los
   encontrás, avisame y los revisamos juntos.
5. **Crear `.env.local`**, copiando la plantilla:

   ```bash
   cp .env.example .env.local
   ```

   En PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Abrí `.env.local` en tu editor y completá los tres valores de Supabase
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY`). **Escribilos vos, directamente en el archivo.**
6. **Comprobar que Git ignora el archivo.** Este comando debe mostrar la regla
   que lo excluye:

   ```bash
   git check-ignore -v .env.local
   ```

   Y `git status` **no** debe listar `.env.local`.

## Reglas de seguridad

- Las variables que empiezan con `NEXT_PUBLIC_` terminan **en el navegador**.
  Solo la URL y la clave publishable pueden llevar ese prefijo.
- `SUPABASE_SECRET_KEY` **nunca** lleva `NEXT_PUBLIC_` y solo se lee desde
  código de servidor.
- No pegues las claves en chats (incluido este asistente), issues, capturas de
  pantalla ni mensajes de commit. Para que yo pueda trabajar con la base
  alcanza con que `.env.local` exista en tu máquina; no necesito ver los
  valores.
- Si una clave se filtra por error: en el panel de Supabase generá una nueva y
  desactivá la anterior, y recién después investigá cómo pasó.
- Datos de desarrollo: solo ficticios. Nada de teléfonos ni clientes reales en
  este proyecto.
- Este proyecto es solo de desarrollo. Producción será otro proyecto, con
  otras claves.

## Límites del plan gratuito que conviene conocer

Según la documentación oficial de Supabase:

- Un proyecto con **poca actividad durante 7 días se pausa**. Se puede
  reanudar desde el panel (*Resume project*) dentro de los 90 días siguientes.
  Con unas pocas consultas por día no se pausa.
- **No incluye backups descargables.** Por eso el esquema vive en Git como
  migraciones y los datos de desarrollo son reproducibles. Para producción
  habrá que elegir un plan con backups (decisión pendiente de aprobación).
- Al enviar mails de autenticación se aplican límites de envío bajos; no
  afecta nuestro desarrollo porque la verificación de clientes es simulada.
