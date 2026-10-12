# 0003 - Puntos como libro inmutable; reglas decididas en el servidor

**Estado:** Aceptada

## Contexto

Los puntos tienen valor para el cliente y para el negocio. Debemos evitar
fraudes, dobles canjes y saldos inconsistentes, y poder auditar qué pasó. El
navegador nunca es confiable para decidir puntos ni canjes.

## Decisión

- El saldo **no es un número editable**. Se guarda un **libro de movimientos**
  (*ledger*): cada visita, ajuste, canje o vencimiento es una fila nueva que
  **no se modifica ni se borra**. El saldo se calcula (o se cachea) a partir
  del libro. Si hay un error, se corrige con un movimiento compensatorio.
- Las operaciones que mueven puntos o recompensas (registrar visita, canjear)
  se ejecutan como **funciones transaccionales en PostgreSQL**. Dentro de una
  misma transacción validan permisos, reglas y saldo, y escriben el
  movimiento. Así, dos pedidos simultáneos no pueden canjear lo mismo dos
  veces.
- El cliente solo envía una **intención** ("quiero canjear la recompensa X").
  La cantidad de puntos, la elegibilidad y el resultado los calcula el
  servidor con la configuración del programa del negocio.
- Las operaciones sensibles son **idempotentes** (una clave de operación evita
  que un reintento o doble clic se aplique dos veces).
- Los movimientos guardan quién los originó (empleado o sistema) para auditoría.

## Consecuencias

- Auditoría completa y reversible; el saldo siempre se puede reconstruir.
- Más trabajo inicial que un simple `UPDATE points = points + 10`, pero es la
  base de un sistema que maneja "dinero blando" sin sorpresas.
- La lógica crítica vive en SQL, por lo que debe cubrirse con tests de
  integración (doble canje, saldo insuficiente, concurrencia) en la etapa 4.
