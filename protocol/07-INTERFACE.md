> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 07 — LA CAPA DE INTERFAZ

**Estado: normativo.** Este es el archivo que da nombre al proyecto.

Toda superficie que un humano toca es **Parvis**. La vista de planta de solo lectura es el
*Parvis HMI*; el menú de mosaicos desde el que gobiernas la flota es la *Parvis Console*.

---

## 1. La regla que hace que el HTML funcione

> Una página de navegador es una **pantalla y un teclado**, no un programa con acceso a disco.

Ese único hecho gobierna toda la capa:

- **La página muestra y recoge.** Representa estado y toma entrada. Abierta desde una ruta de
  archivo, por sí sola, **no puede leer el árbol ni escribir una orden.** El aislamiento del
  navegador prohíbe ambas cosas, y eso es una virtud.
- **El sidecar hace de puente.** Un pequeño servicio de bucle local — enlazado a `127.0.0.1` y a
  nada más — es lo único que lee el árbol para la página y escribe lo que la página envía. La
  página le hace `GET` del estado; la página le hace `POST` de un prompt; el sidecar hace el
  trabajo de disco. **Sin sidecar, no hay Parvis en vivo — solo una instantánea.**
- **Nada sortea la revisión.** Un prompt enviado desde Parvis es una **inducción, no una
  ejecución**. El sidecar escribe una fila `REQ` en el índice de tareas y se detiene. Nunca lanza
  un agente, nunca ejecuta un comando, nunca envía. Comprometer trabajo nuevo sigue siendo la
  pulsación del Operador.

Por eso la página "funciona": la página es honesta sobre ser una ventana, el sidecar hace el
pequeño trabajo real en el borde, y **la revisión sigue interponiéndose entre un prompt y una
máquina en movimiento.**

---

## 2. Requisitos duros — toda superficie Parvis

1. **Autocontenida.** Un solo archivo HTML: CSS y JS en línea, sin scripts externos, sin CDN.
   Fuentes web solo con una pila de reserva real. Debe representarse sin conexión desde una ruta
   de archivo.

2. **Los colores son el estado, leídos en vivo, nunca fingidos.** Verde = en marcha, ámbar =
   pregunta antes, rojo = detenido — derivados del archivo STATE y del libro mayor en vivo. **Un
   valor sin fuente en vivo muestra `—`, nunca un número de apariencia plausible.** El rojo se
   impone a todo otro color y a toda la interfaz.

3. **El sidecar es solo de bucle local y no guarda ningún secreto que la página pueda ver.**
   Ninguna clave de API, ninguna credencial, ningún token de valor llega al navegador. El sidecar
   autentica la página con un token de sesión local y hace él mismo el trabajo privilegiado. **La
   página nunca guarda nada que merezca la pena robar.**

4. **Una instantánea se etiqueta como instantánea,** con su hora de lectura. Solo una página que
   habla con un sidecar vivo puede presentarse como en vivo. Una página obsoleta que parece viva
   es peor que ninguna página.

5. **La parada de emergencia se impone a la interfaz.** Bajo `STOP`, Parvis no induce nada y el
   sidecar no escribe más que la línea de cierre de sesión. **Una planta en rojo no acepta
   órdenes.**

6. **Marca Parvis, y ningún nombre de empresa de terceros.** Sean cuales sean los sistemas reales
   de los que se aprendió el patrón, el patrón es tuyo y se llama Parvis. Una superficie que
   distribuye el nombre comercial de otro está mal y se corrige.

---

## 3. Requisitos de seguridad del sidecar

Un servicio HTTP de bucle local en una estación de trabajo de desarrollo es una superficie de
ataque real. Esto no es opcional.

| Requisito | Por qué |
|---|---|
| **Enlaza `127.0.0.1` explícitamente**, nunca `0.0.0.0` | Enlazar todas las interfaces publica la consola de tu flota en la red local. |
| **Valida la cabecera `Host`** contra una lista de permitidos de `127.0.0.1:<port>` / `localhost:<port>` | Derrota el DNS rebinding, que es como una página web que visitas alcanza un servicio de bucle local. |
| **Rechaza peticiones que traigan un `Origin` que no emitiste** | Misma clase de ataque, distinto vector. |
| **Exige un token de sesión** en toda ruta que mute algo, emitido al cargar la página, nunca registrado | La página demuestra que es tu página. |
| **Pon en lista de permitidos cada ruta** que el servicio vaya a leer o escribir, luego vuelve a resolverla y confirma la contención | Derrota el recorrido de rutas. Una lista de permitidos por sí sola no basta si existen enlaces simbólicos. |
| **Falla de forma segura ante una estop ilegible** — rechaza, no vuelvas por defecto a `RUN` | Véase [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Sin `eval`, sin salida a shell, sin interpolación de plantillas con entrada del usuario** | La barra de prompt es una entrada de inducción, no una línea de comandos. |

La implementación de referencia en [`reference/sidecar/`](../reference/sidecar/) implementa todos
estos requisitos y está comentada en el punto de cada uno.

---

## 4. Cuáles son las superficies

| Superficie | Qué | Estado |
|---|---|---|
| **Parvis Console** | Paneles con pestañas — estado, documentos, libro mayor, bus, superficie, ajustes | Se distribuye. |
| **Parvis Floor** | La pestaña Almacén: planta 3D, órbita y descenso, controles de equipo | Se distribuye. Véase [`09-FLOOR.md`](09-FLOOR.md). |
| **Barra de prompt** | La entrada de inducción, en la consola y en cada pieza de equipo de la planta | Se distribuye. |
| **El sidecar** | Puente de bucle local: lee el árbol, escribe filas `REQ`, no guarda ningún secreto | Se distribuye. |

**Distribuye los paneles primero.** La planta 3D es la parte que todo el mundo quiere construir y
la parte que no vale nada sin el libro mayor debajo — representa estado que el resto del protocolo
produce, y sobre un árbol vacío muestra correctamente nada.

---

## 5. Posición

- **La página lee. El sidecar escribe. El Operador compromete.**
- Ninguna superficie lanza, envía, despliega ni levanta una parada de emergencia.
- Ningún secreto llega al navegador, jamás.
- La salida va a archivos y a la consola, no a una ventana de chat
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
