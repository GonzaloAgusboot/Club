# Decisiones de arquitectura (ADR)

Un ADR (*Architecture Decision Record*) es una nota corta que registra **una**
decisión técnica importante: el contexto, lo que elegimos y sus consecuencias.
No se reescriben cuando cambia la opinión: un ADR nuevo reemplaza al anterior y
lo marca como reemplazado. Así se conserva el "por qué" con el paso del tiempo.

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-modular-monolith-stack.md) | Monolito modular sobre Next.js + Supabase | Aceptada |
| [0002](0002-multi-tenancy-with-rls.md) | Multiempresa: base compartida con Row Level Security | Aceptada |
| [0003](0003-loyalty-ledger-and-server-side-rules.md) | Puntos como libro inmutable; reglas decididas en el servidor | Aceptada |
| [0004](0004-visit-validation-by-staff.md) | El empleado valida la visita; el NFC solo identifica el negocio | Aceptada |
| [0005](0005-customer-identity.md) | Identidad global del cliente, perfil por negocio, teléfono | Aceptada |
| [0006](0006-messaging-provider-abstraction.md) | Mensajería detrás de una interfaz (simulador primero) | Aceptada |
| [0007](0007-locale-timezone-and-conventions.md) | Mercado, zona horaria, idioma y convenciones | Aceptada |
| [0008](0008-development-database.md) | Base de desarrollo: Supabase en la nube (plan gratuito), sin Docker | Aceptada |

Formato de cada ADR: `Estado`, `Contexto`, `Decisión`, `Consecuencias`.
