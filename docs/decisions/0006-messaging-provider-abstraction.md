# 0006 - Mensajería detrás de una interfaz (simulador primero)

**Estado:** Aceptada

## Contexto

Queremos notificar por WhatsApp, pero la API oficial (WhatsApp Business
Platform) cuesta dinero, requiere cuenta verificada y plantillas aprobadas por
Meta. Por ahora no se contratan servicios pagos ni se hacen integraciones
externas.

## Decisión

- El resto del sistema **nunca llama a WhatsApp directamente**. Habla con una
  interfaz propia, `MessagingProvider`, con operaciones como "enviar mensaje" y
  "procesar evento entrante".
- Primera implementación: **`SimulatorProvider`**. No envía nada a la red:
  guarda los mensajes en la base y los muestra en una pantalla de desarrollo
  (como una bandeja de entrada de prueba).
- Más adelante se agrega `WhatsAppCloudProvider`. Cambiarlo es una cuestión de
  configuración (`MESSAGING_PROVIDER`), sin tocar automatizaciones ni chatbot.
- El diseño ya contempla **plantillas**: WhatsApp exige plantillas aprobadas
  para iniciar conversaciones, así que el contrato incluye tipo de mensaje,
  plantilla y variables, no solo texto libre.
- Los mensajes se encolan (ADR futuro de automatizaciones) y registran su
  estado: pendiente, enviado, fallido.

## Consecuencias

- Desarrollo y tests sin costo ni dependencia externa, con mensajes que se
  pueden inspeccionar.
- Riesgo: el simulador puede ser más permisivo que el proveedor real. Se
  mitiga haciendo que el simulador valide las mismas restricciones (plantillas,
  formato de teléfono) y verificando contra la documentación oficial al
  integrar.
