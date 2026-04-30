# Reto Angular - Productos financieros

Aplicación Angular para administrar productos financieros bancarios. El proyecto cubre el alcance Semisenior del reto técnico: listado, búsqueda, selección de cantidad visible, creación, edición, validaciones y navegación por rutas.

## 🧰 Stack

- Angular 20.3
- TypeScript 5.9
- Standalone components
- Signals, `OnPush` y control flow moderno (`@if`, `@for`)
- Reactive Forms
- Jest + Testing Library
- CSS propio, sin Bootstrap, Material, Tailwind ni librerías de componentes

## 🧩 Funcionalidades

| Ruta | Descripción |
| --- | --- |
| `/products` | Lista productos, filtra por texto, muestra contador, selector 5/10/20 y controles de desplazamiento. |
| `/products/new` | Crea productos con validaciones visuales y verificación asíncrona del ID. |
| `/products/:id/edit` | Edita productos existentes con el campo ID deshabilitado. |

Validaciones principales:

- ID requerido, entre 3 y 10 caracteres, y validado contra el servicio de verificación.
- Nombre requerido, entre 5 y 100 caracteres.
- Descripción requerida, entre 10 y 200 caracteres.
- Logo requerido.
- Fecha de liberación igual o mayor a la fecha actual.
- Fecha de revisión calculada exactamente un año después de la fecha de liberación.
- Mensajes visuales bajo cada campo inválido.

Los controles de desplazamiento del listado son una mejora intencional de UX. El enunciado pide seleccionar 5, 10 o 20 registros visibles; si existen más productos que el límite seleccionado, los botones Anterior/Siguiente evitan que el usuario piense que faltan datos.

## ✅ Requisitos

- Node.js 24.x
- npm 11.x
- API local del reto ejecutándose en `http://localhost:3002`

En Windows, usa `npm.cmd` si PowerShell bloquea `npm.ps1`.

## 🔌 API local

El reto solicita consumir el backend Node provisto con el material técnico. Este repositorio contiene solo el frontend Angular para mantener el entregable limpio.

Prepara un workspace donde tengas dicho backend Node.

Para ejecutarlo desde ese workspace:

```bash
cd ../support/product-api
npm.cmd install
npm.cmd run start:dev
```

El servicio debe responder en:

```text
http://localhost:3002/bp/products
```

Angular usa `proxy.conf.json` para redirigir `/bp` hacia el API local.

## 🚀 Ejecución

Instalar dependencias:

```bash
npm.cmd install
```

Levantar la aplicación:

```bash
npm.cmd start
```

Abrir:

```text
http://localhost:4200
```

## 📜 Scripts

| Comando | Descripción |
| --- | --- |
| `npm.cmd start` | Ejecuta Angular en modo desarrollo. |
| `npm.cmd run build` | Genera el build de producción. |
| `npm.cmd test -- --runInBand` | Ejecuta Jest con coverage. |
| `npm.cmd run test:watch` | Ejecuta Jest en modo observación. |

## 🏗️ Arquitectura

- Componentes standalone para reducir módulos innecesarios.
- Capa de servicio dedicada para consumo HTTP.
- Formularios reactivos con validadores personalizados.
- Manejo visual de estados de carga, error y vacío.
- CSS propio alineado con las referencias visuales del reto.
- Separación por feature para mantener el código legible y fácil de extender.

## 🧪 Pruebas

El proyecto usa Jest con umbral global mínimo de coverage:

| Métrica | Umbral |
| --- | --- |
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

Última verificación local:

```text
Test Suites: 5 passed, 5 total
Tests: 14 passed, 14 total
Coverage global: 81.03% statements, 68.18% branches, 80% functions, 80% lines
```
