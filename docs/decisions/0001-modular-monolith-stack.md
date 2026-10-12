# 0001 - Monolito modular sobre Next.js + Supabase

**Estado:** Aceptada

## Contexto

Necesitamos un producto real y mantenible, desarrollado por un equipo pequeño,
con tres "caras": Club del cliente, panel del negocio y administración de la
plataforma. El stack propuesto es Next.js (App Router), TypeScript, Tailwind,
Supabase/PostgreSQL, Vitest y Vercel.

## Decisión

- **Una sola aplicación Next.js** (monolito) con la lógica de negocio separada
  en módulos por dominio (`loyalty`, `customers`, `businesses`, `automations`,
  `messaging`, `chatbot`, `platform`). Nada de microservicios.
- Las pantallas y rutas son finas: validan la entrada y llaman a un módulo. No
  contienen reglas de negocio.
- Toda entrada del usuario se valida en el servidor con **Zod** (única
  dependencia adicional prevista desde el inicio).
- Gestor de paquetes: **npm**. Se agregan dependencias solo cuando hacen falta
  y con una razón escrita.
- Antes de fijar versiones se leen las notas de cambios de Next.js, Vitest y
  TypeScript, porque hubo saltos de versión mayor recientes.

## Consecuencias

- Un solo despliegue, un solo repositorio: menos piezas que romper y más fácil
  de entender para quien se suma.
- Si algún módulo crece mucho (por ejemplo la mensajería), se puede extraer
  después porque ya tiene fronteras claras. Esa separación es la razón de
  organizar por módulos desde el principio.
- Requiere disciplina: las reglas de carpetas se hacen cumplir en revisión
  (y, más adelante, con el linter).
