# 0009 - Versiones de dependencias y herramientas (Etapa 1)

**Estado:** Aceptada

## Contexto

Al armar la base de la aplicación (Etapa 1) hubo que elegir versiones concretas.
Varias herramientas tuvieron saltos de versión mayor recientes y no todas son
compatibles entre sí. Regla del proyecto: versiones estables, sin
experimentales, sin saltos mayores innecesarios.

## Decisión

Versiones elegidas el 2026-10-12 (consultadas en el registro de npm).
`package.json` usa rangos `^` (acepta actualizaciones menores y de parche);
las versiones exactas las fija `package-lock.json`, que se versiona.

| Paquete | Rango | Instalada | Notas |
|---|---|---|---|
| `next` | ^16.4.0 | 16.4.0 | Última estable (`latest`). Requiere Node >= 20.9. |
| `react`, `react-dom` | ^19.3.0 | 19.3.0 | Última estable. |
| `typescript` | **^5.9.3** | 5.9.3 | **No** se usa 7.x. Ver abajo. |
| `tailwindcss`, `@tailwindcss/postcss` | ^4.3.3 | 4.3.3 | Última estable. Ambos deben tener la misma versión. |
| `vitest` | ^5.0.4 | 5.0.4 | Última estable. Requiere Node 22.12+ o 24+. Usa `vite` 8.3.4. |
| `eslint` | **^9.39.5** | 9.39.5 | **No** se usa 10.x. Ver abajo. |
| `eslint-config-next` | ^16.4.0 | 16.4.0 | Siempre la misma versión mayor y menor que `next`. |
| `@types/node` | ^24.19.2 | 24.19.2 | Coincide con la versión mayor de Node del entorno. |

Otras decisiones de esta etapa:

- **Se arma el proyecto a mano**, sin `create-next-app`, para no pisar el
  `README` ni el `.gitignore` de la Etapa 0 y para entender cada archivo.
- **Código fuente en `src/`**; alias `@/` apunta a `src/` (en `tsconfig.json` y
  en `vitest.config.mts`).
- **Textos visibles en `src/messages/es-AR.ts`**, no escritos dentro de los
  componentes (ADR 0007).
- **Fuentes del sistema**, sin descargar fuentes de Google: sin pedidos externos
  y sin dependencia de red durante el build.
- **Tests sin dependencias extra**: la página se renderiza a HTML con
  `react-dom/server` (ya incluido con React). No se instalan `jsdom` ni
  Testing Library hasta que haya interacción que probar.
- `vitest.config.mts` (extensión `.mts`) para que Node lo cargue como módulo ES
  sin cambiar el `package.json` entero a `"type": "module"`.
- `"engines"` en `package.json`: Node `^22.12.0 || ^24.0.0`.
- `tsconfig.json` con `strict` y `noUncheckedIndexedAccess`.

## Compatibilidad verificada (2026-10-12)

Además de los avisos de `peerDependencies`, se comprobó ejecutando:

- `npm ls --all` termina con código 0, sin paquetes `invalid` ni `missing`
  (los `UNMET OPTIONAL` son binarios de otros sistemas operativos y son normales).
- `npm run check` (lint, tipos, pruebas y build) pasa; la página se vio en el
  navegador en escritorio y celular, en modo claro y oscuro.
- TypeScript 5.9.3 con la configuración del proyecto: un archivo con errores
  deliberados produjo exactamente los tres errores esperados (tipo incorrecto,
  `number | undefined` por `noUncheckedIndexedAccess` y `any` implícito por
  `strict`), el alias `@/` resolvió y un `.tsx` correcto compiló sin errores.
- Next recomienda TypeScript >= 5.1 y su propio chequeo de tipos corre en cada
  build.
- No se probó `npm run dev` en esta revisión.

## Por qué no TypeScript 7

`typescript-eslint` 8.71.2 declara soporte para TypeScript `>=4.8.4 <6.1.0`. Con
TypeScript 7 (reescritura nativa) el linter no tendría soporte oficial. Se
revisa cuando `typescript-eslint` lo soporte.

## Por qué no ESLint 10

`eslint-plugin-react` 7.37.5, `eslint-plugin-jsx-a11y` 6.10.2 y
`eslint-plugin-import` 2.32.0 (los usa `eslint-config-next`) declaran soporte
solo hasta ESLint 9.

Se probó en una copia aparte (sin tocar el proyecto): ESLint 10.12.0 **sí se
instala**, con avisos `ERESOLVE overriding peer dependency`, y `npm run lint`
pasa sin errores. O sea, funciona de forma extraoficial. Se descartó por ahora
porque ningún plugin lo soporta oficialmente y porque **no resuelve la
vulnerabilidad de `braces`**: `npm audit` siguió informando las mismas 5
alertas. Se revisa cuando los plugins declaren soporte para ESLint 10.

## Riesgos conocidos y aceptados

### 1. `braces`: aviso de severidad alta sin parche publicado

**Qué informa `npm audit`.** Cinco vulnerabilidades altas. En realidad es **un
solo aviso** (en `braces`) y **cuatro alertas heredadas** de los paquetes que
dependen de él.

- Aviso: GHSA-vfj7-8cjw-p6xm, CVSS 7.5 (`AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H`),
  CWE-674. Publicado el 2026-09-18.
- Qué es: `braces` recorre patrones de llaves con funciones recursivas sin
  límite de profundidad. Un patrón anidado en exceso agota la pila y termina el
  proceso de Node con un `RangeError` (denegación de servicio). No permite
  ejecutar código ni leer datos.
- Rango vulnerable: `braces <= 3.0.3`. **No existe versión corregida**: la base
  de avisos de GitHub informa `patched: []`, y `braces@3.0.3` (instalada) es la
  última publicada (2024-05-21).
- Ruta única de dependencias:
  `club` -> `eslint-config-next@16.4.0` -> `@next/eslint-plugin-next@16.4.0`
  -> `fast-glob@3.3.1` -> `micromatch@4.0.8` -> `braces@3.0.3`.
- Alertas heredadas: `micromatch` (`>=0.2.0`), `fast-glob` (`*`),
  `@next/eslint-plugin-next` y `eslint-config-next` (`>=14.3.0-canary.0`).

**Evidencia obtenida (2026-10-12).**

1. `npm audit --omit=dev` (lo que se despliega): **0 vulnerabilidades**. La
   cadena está solo en `devDependencies`.
2. En `@next/eslint-plugin-next`, `fast-glob` se usa en un único lugar
   (`dist/utils/get-root-dirs.js`) y solo se invoca si la configuración de
   ESLint define `settings.next.rootDir`. Lo usa la regla
   `no-html-link-for-pages`, propia del Pages Router, que este proyecto no
   usa. Nuestro `eslint.config.mjs` no define `rootDir` ni `settings`.
3. Medición: se envolvieron `braces`, `micromatch` y `fast-glob` con un
   contador y se ejecutó un lint real de los 9 archivos del proyecto: los tres
   módulos se **cargan en memoria** pero se registraron **0 llamadas**.
4. La versión canary de Next (`16.5.0-canary.8`) sigue dependiendo de
   `fast-glob 3.3.1`: todavía no hay corrección aguas arriba.

**Alcance.** Solo afecta herramientas de desarrollo (lint). No forma parte del
build ni de lo que se despliega. Para explotarlo habría que hacer llegar a
`braces` un patrón de llaves anidado en exceso; hoy el único patrón que el
linter podría pasarle viene de un ajuste de configuración que escribimos
nosotros y que no está definido. No hay entrada externa involucrada.

**Opciones evaluadas** (probadas en copias aparte, sin modificar el proyecto):

| Opción | Resultado medido | Motivo |
|---|---|---|
| A. No cambiar nada | `npm audit`: 5 altas | **Elegida.** Riesgo práctico nulo y sin tocar dependencias. |
| B. `overrides`: `"fast-glob": "npm:tinyglobby@0.2.17"` | `npm audit`: 0. Lint, tipos, 12 pruebas y build pasan. Mismos resultados que el original en 4 patrones de `rootDir` | No aplicada (ver abajo). |
| C. Quitar `eslint-config-next` | `npm audit`: 0, pero se eliminan 225 paquetes | Se pierden las reglas de Next, React, hooks, accesibilidad y TypeScript; habría que rearmarlas a mano. |
| D. `npm audit fix --force` | No ejecutada | Instalaría `eslint-config-next@14.2.35`, cuyo `peerDependencies` exige `eslint ^7 \|\| ^8`: choca con ESLint 9 y con Next 16. |
| E. Esperar corrección de Next | Sin novedades (ver evidencia 4) | Es lo que se hace, junto con la opción A. |
| F. Pasar a ESLint 10 | `npm audit`: sigue en 5 | No resuelve el problema (ver sección anterior). |

**Por qué no se aplicó el override (opción B) en esta etapa.**

- Es técnicamente viable, pero reemplaza un paquete ajeno por otro mediante un
  alias. Es un parche propio que hay que mantener y revisar con cada
  actualización de `eslint-config-next`.
- Si una versión futura del plugin usara otra función de `fast-glob`, el lint
  fallaría; el costo de mantenimiento es real y el beneficio actual es cosmético
  (dejar `npm audit` en cero), porque el riesgo práctico ya es nulo.
- Se prefiere no modificar el árbol de dependencias por un aviso que no es
  explotable en este uso, y esperar una corrección oficial.
- No se descarta: queda como opción lista para aplicar (ver abajo) si el
  contexto cambia.

**Mientras esta decisión siga vigente.**

- `npm audit` completo seguirá informando 5 altas. Es esperado y está
  documentado acá.
- Cualquier verificación automática de seguridad (por ejemplo el CI de la
  Etapa 11) debe usar `npm audit --omit=dev` como criterio de fallo, y revisar
  el `npm audit` completo a mano para detectar avisos nuevos distintos de este.

**Cuándo hay que reevaluar (obligatorio).**

1. **Ante cualquier actualización** de `next`, `eslint-config-next`,
   `@next/eslint-plugin-next` o `eslint`: comprobar si `fast-glob`/`braces`
   siguen en el árbol (`npm ls braces`) y volver a ejecutar `npm audit`.
2. **Antes de desplegar** (Etapa 12) y **antes de agregar un CI** que audite
   dependencias (Etapa 11): `npm audit --omit=dev` debe dar 0 y el `npm audit`
   completo debe revisarse contra este ADR.
3. **Si `braces` publica una versión corregida** o si Next/ESLint cambian de
   dependencia: aplicar la actualización y quitar este riesgo del ADR.
4. **Si se agrega `settings.next.rootDir` a la configuración de ESLint o se
   empieza a usar el Pages Router**: la evidencia 2 y 3 deja de valer y hay que
   reevaluar de inmediato.
5. Como mínimo, al cerrar la Etapa 11 aunque nada de lo anterior haya pasado.

Comandos para reevaluar:

```bash
npm ls braces
npm audit
npm audit --omit=dev
```

### 2. ESLint 9.39.5 figura como "ya no soportado"

El registro de npm marca esa versión con el mensaje "This version is no longer
supported". Es solo una herramienta de desarrollo y no se incluye en lo que se
despliega, pero implica que esa línea ya no recibe correcciones. Se migra a
ESLint 10 cuando los plugins lo soporten oficialmente (ver arriba).

### 3. `unrs-resolver` tiene un script `postinstall`

Es parte del linter. npm no lo ejecuta sin autorización explícita y no se
autoriza: el binario nativo para Windows ya se instala como dependencia
opcional y el lint funciona sin el script.

## Consecuencias

- El stack instala y funciona sin `--force` ni `--legacy-peer-deps`, y sin
  `overrides` en `package.json`.
- `npm audit` completo no termina en cero hasta que se resuelva el riesgo 1;
  por eso hay que auditar lo desplegable con `--omit=dev` (ver arriba).
- Hay que revisar periódicamente la compatibilidad para pasar a TypeScript 7 y
  ESLint 10, y repetir la evaluación del riesgo 1 en los momentos indicados.
- `package-lock.json` se versiona: garantiza que todos instalen exactamente las
  mismas versiones.
