# 0005 - Identidad global del cliente, perfil por negocio, teléfono

**Estado:** Aceptada

## Contexto

Un mismo cliente puede ir a varias cafeterías de la plataforma. Queremos que no
tenga que registrarse de nuevo, pero que cada negocio vea y maneje solo a sus
propios clientes. En Argentina el teléfono es el identificador natural.

## Decisión

- **Identidad global:** una persona se identifica por su teléfono en formato
  internacional **E.164** (por ejemplo, `+54...`), que se guarda normalizado.
  Esto sirve para Argentina y no bloquea otros países.
- **Perfil por negocio:** la relación entre la persona y cada negocio es un
  registro propio (puntos, visitas, preferencias, consentimientos). Dos
  negocios no comparten saldo ni historial.
- Un negocio **no puede ver** en qué otros negocios participa un cliente ni sus
  datos en ellos. Solo ve su propio perfil (RLS, ADR 0002).
- **Verificación del teléfono:** durante el desarrollo es **simulada** (un
  código fijo o visible en una pantalla de desarrollo). No se envía ningún
  mensaje ni SMS real. La verificación real se implementa con el proveedor de
  mensajería cuando se apruebe (ADR 0006).
- Datos personales (teléfono, cumpleaños, preferencias): se pide
  **consentimiento** explícito, se guardan solo los necesarios y se prevé
  exportación y baja. Argentina tiene la Ley 25.326 de protección de datos
  personales; antes de salir a producción debe validarse con asesoramiento
  legal.

## Consecuencias

- Mejor experiencia para el cliente y base para un futuro "Club de Clubes".
- Hay que tratar el teléfono como dato personal sensible en logs y exportaciones
  (no se registra en texto plano en logs).
- La separación persona / perfil agrega una tabla más al modelo, pero evita
  rehacerlo si luego se suman otros países.
