# Club

> Nombre provisional.

SaaS multiempresa de fidelización de clientes para cafeterías, restaurantes,
hoteles, heladerías y negocios similares. El cliente abre un "Club" digital
desde el celular al acercarlo a un tag NFC (abre una URL, sin instalar ninguna
app) y acumula visitas, puntos y recompensas.

## Estado

**Etapa 1: aplicación mínima.** Hay una aplicación Next.js que muestra una
primera página informativa. Todavía no hay login, base de datos, clientes ni
puntos. Ver el [plan de desarrollo](#plan-de-desarrollo).

## Alcance del producto

1. **Club del cliente**: registro, inicio de sesión, perfil, visitas, puntos, recompensas e historial.
2. **Panel del negocio**: clientes, estadísticas, sucursales, empleados, configuración del programa de fidelización y personalización visual.
3. **CRM**: segmentación, frecuencia de visitas, cumpleaños, preferencias y clientes inactivos.
4. **Automatizaciones**: eventos y reglas configurables que generan notificaciones.
5. **WhatsApp**: simulador funcional para desarrollo; luego la API oficial de WhatsApp Business Platform.
6. **Chatbot**: consultas de puntos, recompensas y beneficios.
7. **Administración de la plataforma**: negocios, usuarios, roles, planes y suscripciones.
8. **Seguridad y operación**: aislamiento entre negocios, validación en el servidor, logs, tests, backups y manejo de errores.

## Reglas de trabajo

- Multiempresa desde la primera tabla. El aislamiento lo hace cumplir la base
  de datos (Row Level Security), no solo el código de la aplicación.
- Nunca se confía en el navegador para decidir cuántos puntos se otorgan ni si
  una recompensa puede canjearse. Eso lo decide el servidor/la base de datos.
- Sin secretos en el frontend ni en Git. Solo se registra `.env.example`
  (nombres, sin valores).
- WhatsApp vive detrás de su propia interfaz, para cambiar el simulador por el
  proveedor real sin tocar el resto del sistema.
- Sin servicios pagos ni integraciones externas hasta aprobarlos.
- Etapas pequeñas y verificables; un commit revisable por paso.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth),
Vitest y Vercel. Gestor de paquetes: npm. Las versiones elegidas y el motivo
están en el [ADR 0009](docs/decisions/0009-dependency-versions-and-tooling.md).
Supabase todavía no está conectado.

Convenciones: nombres técnicos (código, tablas, funciones) en inglés; textos de
la interfaz en español rioplatense (es-AR). Zona horaria por defecto
`America/Argentina/Cordoba`. Mercado inicial: Argentina, diseñado para poder
sumar otros países.

## Estructura del repositorio

```
.
├─ src/
│  ├─ app/              Rutas y pantallas (Next.js App Router)
│  └─ messages/         Textos de la interfaz en es-AR
├─ tests/unit/          Pruebas automáticas (Vitest)
├─ docs/
│  ├─ decisions/        Decisiones de arquitectura (qué elegimos y por qué)
│  └─ setup/            Guías paso a paso (p. ej. proyecto Supabase)
├─ package.json         Dependencias y comandos (npm run ...)
├─ package-lock.json    Versiones exactas instaladas (se registra en Git)
├─ tsconfig.json        Reglas de TypeScript
├─ next.config.ts       Configuración de Next.js
├─ postcss.config.mjs   Conecta Tailwind CSS con el build
├─ eslint.config.mjs    Reglas del linter
├─ vitest.config.mts    Configuración de las pruebas
├─ .env.example         Nombres de variables de entorno (sin valores)
├─ .gitignore           Lo que Git nunca debe registrar (secretos, builds)
├─ .gitattributes       Saltos de línea consistentes entre Windows y Linux
└─ README.md            Esta portada
```

Las carpetas `src/modules/`, `src/lib/` y `supabase/migrations/` se crean
cuando haya algo que poner en ellas.

## Comandos

Requiere Node `^22.12` o `^24` y npm.

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias (la primera vez) |
| `npm run dev` | Servidor de desarrollo en <http://localhost:3000> |
| `npm test` | Ejecuta las pruebas una vez |
| `npm run test:watch` | Pruebas que se repiten al guardar cambios |
| `npm run typecheck` | Revisa los tipos de TypeScript sin generar archivos |
| `npm run lint` | Revisa el estilo y errores comunes del código |
| `npm run build` | Genera la versión de producción |
| `npm run check` | Todo lo anterior en orden: lint, tipos, pruebas y build |

## Plan de desarrollo

| Etapa | Contenido |
|---|---|
| 0 | Git, reglas de exclusión, plantilla de entorno, README, decisiones de arquitectura (hecha) |
| 1 | Base Next.js + TypeScript + Tailwind + Vitest, lint y build (**actual**) |
| 2 | Modelo de datos multiempresa, roles, RLS y tests de aislamiento |
| 3 | Autenticación del personal y panel mínimo (negocio, sucursal) |
| 4 | Núcleo de fidelización: libro de puntos, visitas, recompensas y canje |
| 5 | Club del cliente: registro, perfil, puntos, historial, flujo NFC |
| 6 | Panel completo del negocio |
| 7 | CRM |
| 8 | Eventos, automatizaciones y cola de notificaciones |
| 9 | Capa de mensajería + simulador de WhatsApp + chatbot por reglas |
| 10 | Admin de plataforma: planes y suscripciones (solo modelo de datos, sin cobro) |
| 11 | Operación: logs, errores, auditoría, backups, CI |
| 12 | Despliegue en Vercel y WhatsApp real (solo cuando se apruebe) |

Cada etapa termina con comprobaciones ejecutadas y un commit; la siguiente
empieza solo con aprobación explícita.

## Verificar esta etapa

```bash
npm run check
git status
git ls-files
```

`npm run check` debe terminar sin errores. `git ls-files` no debe listar
`.env.local`, `node_modules/`, `.next/`, claves ni datos personales.

## Documentación

- [Decisiones de arquitectura](docs/decisions/README.md)
- [Creación segura del proyecto Supabase](docs/setup/supabase.md)
