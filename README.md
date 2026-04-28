# Reto Angular - Productos financieros

Aplicacion Angular 20 para administrar productos financieros de un banco. Cubre el alcance Semisenior del reto tecnico: listado, busqueda, cantidad visible de registros, creacion, edicion y rutas.

## Stack

- Angular 20.3
- TypeScript 5.9
- Standalone components, signals y control flow moderno
- Reactive forms
- Jest + Testing Library
- CSS propio, sin framework de estilos ni componentes prefabricados

## Requisitos

- Node.js 24.x
- npm 11.x
- API local del reto ejecutandose en `http://localhost:3002`

En Windows usa `npm.cmd` si PowerShell bloquea `npm.ps1`.

## API local

El reto indica consumir un backend Node local provisto junto con el material tecnico. Este repositorio contiene solo el frontend Angular para mantener el entregable limpio.

En el workspace usado durante el desarrollo, el API de soporte quedo preservado en:

```text
../support/product-api
```

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

## Ejecucion local

Instala dependencias:

```bash
npm.cmd install
```

Ejecuta Angular:

```bash
npm.cmd start
```

La app queda disponible en:

```text
http://localhost:4200
```

El proxy de Angular redirige `/bp` hacia `http://localhost:3002`.

## Scripts

```bash
npm.cmd start
npm.cmd run build
npm.cmd test -- --runInBand
```

## Funcionalidades

- `/products`: listado de productos, busqueda, selector 5/10/20 y contador de resultados visibles.
- `/products/new`: formulario de creacion con validaciones visuales.
- `/products/:id/edit`: formulario de edicion con ID deshabilitado.

Validaciones principales:

- ID requerido, 3 a 10 caracteres y verificacion de existencia via API.
- Nombre requerido, 5 a 100 caracteres.
- Descripcion requerida, 10 a 200 caracteres.
- Logo requerido.
- Fecha de liberacion igual o mayor a la fecha actual.
- Fecha de revision calculada exactamente un anio despues de la fecha de liberacion.

## Pruebas

El proyecto usa Jest con umbral global minimo de coverage:

- statements: 70%
- branches: 60%
- functions: 70%
- lines: 70%

Ultima verificacion local:

```text
Test Suites: 5 passed, 5 total
Tests: 14 passed, 14 total
Coverage global: 81.03% statements, 68.18% branches, 80% functions, 80% lines
```
