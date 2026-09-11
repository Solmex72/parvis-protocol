> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 04 — EL CONTRATO DE SALIDA

**Estado: normativo.** Adónde va el trabajo cuando está terminado.

---

## 1. La regla

**No informes al chat. Trabaja en el árbol de archivos, escribe la salida en disco y expón un
puntero.**

Un agente que termina escribiendo una respuesta larga en una ventana de chat ha puesto su salida
donde nada más en la flota puede leerla — ningún otro agente, ningún monitor, ninguna consola,
ninguna sesión siguiente. El archivo es el registro duradero; el chat es una transcripción que
nadie aguas abajo ve.

---

## 2. Adónde va la salida

| Tipo de salida | Aterriza en |
|---|---|
| Producto de trabajo, hallazgos, un informe | el archivo propietario, o `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Cualquier cosa que el Operador deba ver ahora | un archivo puntero corto en `_os/events/surface/` |
| Una petición que necesita al Operador | `_os/exchange/requests/REQ-<slug>.md` |
| La fila del libro mayor | `_os/tasks/INDEX.md` |

**El directorio `surface/` es la notificación. El archivo es la sustancia.** Escribe la sustancia
en su sitio propio, y después deja un puntero de una línea en `surface/` para que la consola
muestre al Operador dónde aterrizó.

---

## 3. El índice de tareas

Una fila por orden. Añade una fila `REQ` **antes** de empezar, para que una tarea interrumpida
siga siendo visible.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Una fila `DONE` sin ruta de evidencia es inválida.** Si no hay archivo, el trabajo no aterrizó
en ningún sitio que el Operador pueda ver. El autoinforme es `[CLAIMED]`; el archivo es lo que lo
hace `[PROVEN]`.

**Un rechazo pertenece aquí de forma permanente.** Es como la flota deja de volver a litigar
cuestiones zanjadas. No lo borres después.

**El límite honesto:** este índice no observa nada. Es exactamente tan completo como los agentes
que escriben en él. Una tarea ausente de él no es prueba de que la tarea nunca ocurriera — solo
de que nadie la registró. Trata una fila como *una afirmación con una ruta de evidencia
adjunta*, nunca como prueba. Verifica que el archivo de evidencia existe antes de fiarte de
cualquier `DONE`.

---

## 4. Terminar es que el Operador lo vea

No que un agente lo declare. Una respuesta no es un punto de parada: los monitores siguen armados
a través de ella, el trabajo continúa, y después hay una despedida deliberada.

---

## 5. La contrarregla que se impone al encaminamiento

**La parada de emergencia y la franqueza siguen yendo al humano, de inmediato y de forma
prominente.**

Un fallo se expone con la misma prominencia que un éxito. Encaminar la salida a archivos nunca
debe convertirse en un lugar donde enterrar un mal resultado. Si las buenas noticias de la flota
llegan por chat y las malas llegan en un archivo que nadie abre, el contrato se ha invertido y la
flota está mintiendo por encaminamiento.

---

## 6. El límite honesto del propio contrato

Un agente que se ejecuta dentro de un arnés de chat sigue representando texto de asistente en ese
chat — este contrato no puede redirigir el arnés. Lo que sí obliga es **lo que un agente elige
escribir**: la sustancia en archivos, y el texto del chat reducido a un puntero corto —
*"escrito en `<path>`, expuesto a la consola"* — nunca el informe completo.

---

## 7. Ningún secreto llega a la superficie

`surface/` lo lee una consola y puede mostrarse en una pantalla, en una captura o en una ventana
compartida. Las reglas de zonas de datos ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) se aplican aquí
con toda su fuerza.
