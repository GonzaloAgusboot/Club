# 0007 - Mercado, zona horaria, idioma y convenciones

**Estado:** Aceptada

## Contexto

El mercado inicial es Argentina, pero no queremos que una expansión posterior
obligue a rehacer el producto.

## Decisión

- **Mercado inicial:** Argentina. Moneda ARS, teléfono argentino.
- **Zona horaria por defecto:** `America/Argentina/Cordoba`. Las fechas y horas
  se **guardan en UTC** (`timestamptz`) y se convierten para mostrarlas. Cada
  negocio tendrá su propia zona horaria configurable (por defecto la de
  arriba), porque "cumpleaños de hoy" e "inactivo hace 30 días" dependen de la
  hora local del negocio.
- **Teléfonos:** formato internacional E.164 en la base; la interfaz acepta y
  muestra el formato argentino habitual.
- **Idioma:** textos de la interfaz en **español rioplatense (es-AR)**,
  guardados en archivos de mensajes y no escritos a mano en los componentes,
  para poder traducir luego.
- **Código:** nombres técnicos en inglés (tablas, columnas, funciones,
  variables, tipos). Documentación en español.
- **Git:** rama principal `main`, commits pequeños con mensaje en inglés,
  imperativo y descriptivo (por ejemplo, `Add repository foundation`).
- **Dinero y puntos:** los importes se guardan como enteros en la unidad mínima
  (centavos) o con tipo numérico exacto; nunca como números de punto flotante.

## Consecuencias

- Sumar otro país implica agregar su formato de teléfono, moneda, zona horaria
  e idioma, no cambiar el modelo.
- Hay que ser cuidadosos con las zonas horarias en las consultas del CRM;
  se cubrirán con tests.
