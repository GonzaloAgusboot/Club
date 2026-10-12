# 0002 - Multiempresa: base compartida con Row Level Security

**Estado:** Aceptada

## Contexto

Muchos negocios usarán la misma plataforma. Los datos de uno no deben ser
visibles ni modificables por otro, ni siquiera si el código de la aplicación
tiene un error.

## Decisión

- **Una sola base de datos** PostgreSQL compartida. Cada tabla que pertenece a
  un negocio lleva una columna `business_id`.
- El aislamiento lo hace cumplir **Row Level Security (RLS)** de PostgreSQL:
  la propia base rechaza las filas que el usuario no debe ver, sin depender de
  que cada consulta recuerde un `WHERE business_id = ...`.
- RLS se activa en **todas** las tablas del esquema público desde su creación.
  Una tabla sin políticas no devuelve nada (denegar por defecto).
- Se escriben **tests de aislamiento**: crean dos negocios y demuestran que el
  usuario A no puede leer, insertar ni modificar datos de B. Una política sin
  test se considera sin verificar.
- Roles de negocio: `owner`, `manager`, `staff`. Rol de plataforma:
  `platform_admin`. El cliente final es un perfil por negocio (ver ADR 0005).
- La clave `secret` (service role) de Supabase **saltea RLS**. Se usa solo en
  el servidor, lo mínimo indispensable y nunca llega al navegador.

## Consecuencias

- Seguridad en capas: aunque falle una pantalla o una consulta, la base protege
  los datos.
- Las políticas hay que diseñarlas con cuidado: una mal escrita puede ser lenta
  o dejar un hueco. Por eso se prueban y se revisan los avisos de seguridad de
  Supabase en cada etapa.
- Descartamos una base por negocio: es seguro pero inmanejable (migraciones,
  costos y backups multiplicados) a la escala objetivo.
