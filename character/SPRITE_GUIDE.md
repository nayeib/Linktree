# Guía de sprites para el personaje

Esta carpeta contiene las animaciones del personaje que se usan para cada enlace y estado.

## Estructura de carpetas

- `character/default/` - animación predeterminada cuando no hay imágenes específicas.
- `character/x/` - animación para el enlace de X.
- `character/f95zone/` - animación para el enlace de F95Zone.
- `character/patreon/` - animación para el enlace de Patreon.
- `character/itchio/` - animación para el enlace de Itch.io.

## Nombres de archivos para cada estado

Cada estado utiliza una serie de PNG numerados:

### Idle
- `idle_000.png`
- `idle_001.png`
- `idle_002.png`
- ...
- `idle_009.png`

El código actual usa 10 cuadros por defecto para idle. Si colocas menos archivos, ajusta `frames.idle` en `main.js`.

### Blink
- `blink_000.png`
- `blink_001.png`
- `blink_002.png`
- `blink_003.png`

Blink es una animación corta que se reproduce cuando el usuario confirma o se abre el modal.

### Look (mirar)
- `look_000.png`
- `look_001.png`
- `look_002.png`
- `look_003.png`
- `look_004.png`

El estado `look` se usa cuando se abre el modal de confirmación y el personaje activa la animación de "mirar".

## Convenciones de estilo por enlace

- `x`:
  - Gorra de Amazon y detalles de X si se usa para el enlace de X.
- `f95zone`:
  - Estilo comunitario o temática de foro.
- `patreon`:
  - Estilo de creador con detalles rojos/amarillos.
- `itchio`:
  - Estilo de juego independiente con contraste naranja.

## Recomendaciones

- Mantén el tamaño de cada PNG consistente para evitar saltos en la animación.
- Si quieres usar un spritesheet en lugar de archivos sueltos, genera las imágenes numeradas primero y luego convierte el spritesheet a secuencia si lo deseas.
- En caso de que falte una carpeta o un archivo del personaje, el código usa la animación `default` como respaldo.
