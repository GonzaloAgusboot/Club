/**
 * User-facing texts in Rioplatense Spanish (es-AR).
 *
 * Components never hard-code visible text: they read it from here. That keeps
 * wording in one place and makes a future translation a matter of adding
 * another file with the same shape (see ADR 0007).
 */
export const esAR = {
  site: {
    name: "Club",
    tagline: "Fidelización de clientes para comercios",
    description:
      "Club es una plataforma de fidelización para comercios: tus clientes suman visitas y puntos, y canjean recompensas desde el celular, sin instalar ninguna aplicación.",
  },
  home: {
    badge: "En construcción",
    title: "Que tus clientes vuelvan, una visita tras otra.",
    lead: "Club es una plataforma de fidelización para comercios como cafeterías, restaurantes, hoteles y heladerías. Tus clientes suman visitas y puntos, y canjean recompensas desde el celular, sin instalar ninguna aplicación.",
    featuresHeading: "Qué ofrece Club",
    features: [
      {
        title: "Sin aplicación",
        description:
          "Con solo acercar el celular a un tag NFC, se abre el Club de tu comercio en el navegador.",
      },
      {
        title: "Puntos y recompensas",
        description:
          "Cada comercio define su propio programa: cuánto se suma por visita y qué se puede canjear.",
      },
      {
        title: "Conocé a tu clientela",
        description:
          "Mirá quién vuelve, quién se alejó y a quién saludar en su cumpleaños.",
      },
    ],
    statusNote:
      "Esta es la primera versión del sitio: todavía no se pueden crear cuentas ni sumar puntos.",
  },
} as const;
