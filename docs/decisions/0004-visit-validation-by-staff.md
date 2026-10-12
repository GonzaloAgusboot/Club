# 0004 - El empleado valida la visita; el NFC solo identifica el negocio

**Estado:** Aceptada

## Contexto

Un tag NFC contiene una URL. Esa URL se puede copiar y compartir, o abrir desde
cualquier lugar. Si tocar el tag otorgara puntos, cualquiera podría
defraudar al negocio sin estar presente.

## Decisión

- El tag NFC contiene una URL pública que **solo identifica el negocio** (y,
  opcionalmente, la sucursal) y abre su Club. **No otorga puntos.**
- Una visita se registra **desde el panel del empleado**: el empleado identifica
  al cliente (por su teléfono o por un código que el cliente muestra) y
  confirma la visita.
- El cliente **no puede asignarse puntos por su cuenta** por ningún medio.
- Solo los roles `owner`, `manager` y `staff` del negocio pueden registrar
  visitas, y solo en su propio negocio (ver ADR 0002).
- La URL del tag no contiene información sensible ni permite acciones.

## Consecuencias

- Es el modelo más seguro y simple para empezar. La contrapartida: requiere un
  paso del empleado en caja.
- Dejamos abierta como **opción futura configurable** la autovalidación con
  límites (por ejemplo, una visita por día por negocio), que requeriría un
  nuevo ADR y análisis de abuso.
