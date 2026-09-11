> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 09 — LA PLANTA

**Estado: normativo para el visualizador; informativo como modelo.**
Implementado por [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. La afirmación

Una flota de agentes es difícil de ver. Un árbol de archivos es una lista, una tabla de procesos
es una lista y un registro es una lista — así que la única imagen que alguien tiene de una flota
en marcha son varias listas que no encajan entre sí.

**Un almacén automatizado es la misma máquina, y lleva cuarenta años siendo legible.** Las grúas
mueven cargas entre estanterías bajo un sistema de control, y la persona que lo supervisa lee una
planta de cientos de movimientos simultáneos de un vistazo, por color, sin leer una sola línea de
texto.

Parvis toma eso prestado. No como decoración — como un *mapeo*, donde cada objeto del almacén
corresponde exactamente a una cosa del árbol, y donde las propias reglas de seguridad del almacén
resultan ser las reglas de seguridad del protocolo ya dibujadas en el lugar correcto.

---

## 2. El mapeo

| En la planta | En la flota | Leído de |
|---|---|---|
| **Grúa** | un agente, o una sesión viva | los marcadores de sesión en `_os/exchange/bus/session/` |
| **Palé** | un directorio | el propio árbol; la etiqueta del palé es su ruta |
| **Ubicación en estantería** | dónde vive ese directorio | su padre |
| **Abrir un palé** | descender al directorio | **otro almacén entero** — §4 |
| **Induct** (muelle de entrada) | trabajo que llega | una fila `REQ` en `_os/tasks/INDEX.md` |
| **Spur** (muelle de salida) | un entregable que sale | un archivo en `_os/events/surface/`, una exportación |
| **Cinta transportadora** | el bus de archivos | `_os/exchange/bus/` — cómo se mueve el trabajo sin que lo lleve una grúa |
| **Camión** | un servicio externo u otra IA | la frontera. §5 |

Lo importante no es el dibujo. Lo importante es que **ya sabes leer esta pantalla** si alguna vez
te has puesto delante de un sistema de control de almacén — y si no, el modelo sigue siendo
concreto de una forma en que un listado de directorio no lo es.

---

## 3. Los colores

Un vistazo, antes de navegar nada:

| Color | En la planta | En la flota |
|---|---|---|
| **VERDE** | en movimiento — una grúa lleva una carga | un agente está trabajando; una sesión viva a mitad de tarea |
| **AZUL** | programado — en cola, aún no empezado | una publicación del tablón: ordenada, esperando a un agente |
| **ÁMBAR** | atención — una ubicación necesita una decisión | `YELLOW`: pregunta antes de cada acción |
| **ROJO** | parada de emergencia — esa zona está detenida | `STOP`: la parada está armada y esta raíz está congelada |
| **GRIS** | vacío, o sin fuente en vivo | sin datos. Nunca una suposición. |

Este no es un esquema nuevo. Es el estado que el árbol ya contiene, representado.

**El rojo siempre gana el vistazo.** Una sola zona roja detiene el ojo antes que cualquier verde,
exactamente igual que la parada se impone a toda otra señal ([`01`](01-ESTOP.md)). **Una planta
que muestra verde sobre una zona roja está mintiendo** — y ese es el fallo concreto que esta regla
existe para prohibir.

**El gris es obligatorio donde no hay fuente en vivo.** Una ubicación sin datos se representa en
gris y lee `—`. Nunca se representa en verde, porque el verde es el valor por defecto agradable
([`07`](07-INTERFACE.md) §2.2).

---

## 4. El almacén anidado

**Abre un palé y no estás mirando una caja. Estás mirando otro almacén entero** — con sus propias
grúas, sus propios palés, sus propios muelles.

Esto es el árbol de archivos exactamente. Una iniciativa es un almacén; sus departamentos son
pasillos; sus archivos son palés; y un palé que es a su vez un directorio es otra planta. Así que
el visualizador es **una sola vista que desciende**, con los mismos controles a cada profundidad,
porque cada nivel *es* un almacén. No hay nada nuevo que aprender según se baja.

La recursión es toda la razón por la que la metáfora se sostiene en vez de ser un revestimiento.
Un panel que solo representa el nivel superior es una foto de una flota; uno que desciende es una
vista de ella.

---

## 5. Los camiones atracan en la frontera — nunca entran en la planta

Aquí es donde el modelo deja de ser una visualización y empieza a imponer algo.

Un servicio externo — otra IA, una API, un proveedor — es un **camión**. Y en un almacén real un
camión da marcha atrás hasta un muelle. No entra en la planta, no mueve una grúa, no accede a una
estantería ni abre un almacén anidado. Deja una carga en un induct o recoge una de un spur, y eso
es la totalidad de su acceso.

**Ese muelle es la esclusa.** Todo intercambio externo ocurre en el borde, filtrado, y nada
externo queda suelto dentro del árbol.

**La documentación de un camión no es de fiar hasta que se comprueba.** Una carga que llega en un
camión son *datos* de entrada, no una orden para la planta. Se induce y se revisa como cualquier
otra cosa, nunca se obedece al llegar. Esa es la frontera de origen de instrucciones de
[`03`](03-BUS.md) §5, dibujada como un muelle de carga — y dibujada en el único sitio donde
alguien que mira la pantalla puede ver que se respeta.

Si tu representación pone un camión en la planta, la representación está mal y también lo está la
arquitectura que dibuja.

---

## 6. Dos superficies, dos trabajos

| | **La planta** (este archivo) | **La consola** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Qué es | una planta 3D, vista en vivo | un menú de mosaicos, escalonado por acceso |
| Qué muestra | **cómo está el sistema** — cada agente, directorio y estado a la vez | **qué puedes hacer** — elige la herramienta, haz el trabajo |
| El verbo | mirar, entender, decidir | ejecutar, usar, producir |

**La planta muestra cómo piensa la máquina; la consola sirve para actuar sobre lo que concluyes.**
Una es un mapa, la otra un banco de trabajo. Una superficie de gestión necesita ambas, y el error
es construir solo la bonita.

---

## 7. Controles

La navegación es lo que hizo usable el original, no el color por sí solo:

| Control | Hace |
|---|---|
| **Arrastrar** | orbitar la planta — rotar, inclinar, mirar a lo largo de un pasillo |
| **Cenital** | bajar a un plano desde arriba. Órbita para profundidad, plano para disposición |
| **Clic en un palé** | descender a él — otro almacén, mismos controles |
| **Rueda** | zum |

Los mismos controles a cada profundidad. No negociable: una vista cuya interacción cambia según
desciendes ha roto la promesa de que cada nivel es un almacén.

### La cámara es ortográfica, a propósito

**No hay división en perspectiva**. Las líneas paralelas nunca convergen, y una ubicación al fondo
de un pasillo se representa exactamente del mismo tamaño que una a tus pies.

Esto parece erróneo por un momento — el ojo espera convergencia y lee su ausencia como si
estuviera de pie dentro de las cajas mirando afuera. Aun así es el intercambio correcto, y es lo
que usan las pantallas de control de plantas automatizadas reales: **todo el objetivo es comparar
ubicaciones a lo largo de la planta de un vistazo**, y una cámara en perspectiva hace que el fondo
de un pasillo sea más pequeño, más tenue y más difícil de juzgar que el extremo cercano. Bajo
perspectiva, "esa estantería está más llena" y "esa estantería está más cerca" parecen lo mismo.
Bajo una cámara ortográfica, no.

La oclusión sigue siendo real — las caras que se alejan se descartan y la geometría más cercana
pinta sobre la más lejana. Es una cámara plana, no una escena plana.

El equipo también es alcanzable desde un **menú lateral**, agrupado por tipo — grúas, palés, los
dos muelles, la cinta, los camiones. Seleccionar desde el menú o desde la planta abre los mismos
controles, porque una planta que solo puedes navegar haciendo clic en cajas pequeñas de una escena
3D es una demo y no un instrumento.

---

## 8. Lo que la planta puede y no puede hacer

Toda restricción de [`07`](07-INTERFACE.md) §5 se aplica. La línea se traza en un punto concreto:

**La planta puede inducir. Nunca puede ejecutar.**

Esa es la misma línea que [`07`](07-INTERFACE.md) §1 ya traza para la consola, y es lo que permite
que el equipo tenga controles en absoluto. Seleccionar una grúa y dirigirle trabajo escribe una
fila `REQ` que nombra a ese agente y deja un `TELL` en su buzón. **No inicia nada.** No se lanza
ningún proceso, no se ejecuta ningún comando, y el agente recoge el trabajo en su propia siguiente
ejecución — o no.

Dos consecuencias que es fácil equivocar:

- **El trabajo dirigido sigue sin ser una orden.** La fila `REQ` es el registro canónico; la línea
  del buzón solo apunta a ella. Un archivo que *ordenara* a un agente — o que reclamara la
  autoridad del Operador desde dentro del árbol — sería el evento de seguridad que define
  [`03`](03-BUS.md) §5, y construir eso dentro de la superficie sería peor que construirlo a mano.
  La autoridad es el Operador en conversación. La planta escribe el registro, no la instrucción.
- **Cierto equipo no recibe controles, deliberadamente.** La cinta transportadora es de solo
  lectura: una consola que pudiera escribir líneas en el bus estaría fabricando una autoridad que
  el protocolo le niega. Los camiones no tienen controles en absoluto — §5.

**Bajo `STOP`, la planta se representa en rojo y no induce nada.** Una planta en rojo no acepta
órdenes.

El límite honesto, dicho una vez: **esto es una foto del árbol en un momento, no un flujo de
telemetría en vivo.** Sondea. Entre sondeos está obsoleta, muestra cuándo leyó por última vez, y
se pone gris en lugar de fingir lo contrario cuando el sidecar deja de responder.
