> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 02 — EVIDENCIA

**Estado: normativo.** Cómo una observación se convierte en un hecho registrado.

La disciplina que describe este archivo suele aplicarse a *propuestas* — un agente dice qué
probabilidad tiene su plan de funcionar antes de que el humano decida. Casi nunca se aplica a las
*afirmaciones*. Así que una flota razona con cuidado sobre lo que quiere permiso para **hacer**,
y con descuido sobre lo que anota como **cierto**.

Son el mismo acto. Una afirmación que entra en el registro es una propuesta de que el registro
cambie. Parvis aplica una sola disciplina a ambos.

---

## 1. Toda afirmación lleva una etiqueta

| Etiqueta | Significa | Admisible en |
|---|---|---|
| `[PROVEN]` | Verificado contra una fuente primaria citada **que has leído en esta ejecución**. Nombra el comando, la lectura, la medición. | En cualquier sitio, incluido un archivo maestro. |
| `[CLAIMED]` | Informado por otra cosa. Sin verificar. | Archivos de trabajo. Nunca un archivo maestro. |
| `[ASSUMED]` | Una premisa de trabajo que nadie ha comprobado. | Archivos de trabajo, de forma explícita. |
| `[PROPOSED]` | Una estimación, una recomendación, un plan. | Propuestas. Nunca el registro. |

**La etiqueta viaja con la afirmación.** Un `[PROPOSED]` no se convierte en `[PROVEN]` por
copiarse a un archivo más importante. La promoción exige una medición nueva, no una ubicación
nueva.

**Solo `[PROVEN]` puede cambiar un archivo maestro.**

---

## 2. Cita o marca — nunca blanquees

Un número declara su fuente o no es un número: es una intuición con un punto decimal puesto.

Si no tienes la fuente, **dilo y da el razonamiento en su lugar.** Esa es una respuesta útil. Un
número sin fuente presentado como hecho, no.

**Nunca blanquees un fallo convirtiéndolo en un hallazgo.** Una búsqueda que dio error es una
llamada fallida, no un conjunto de resultados vacío. Una página que no cargó no es prueba de
ausencia. Escribe lo que ocurrió.

---

## 3. La autodescripción es `[CLAIMED]`

El relato que un agente hace de su propio estado, su propia cobertura o su propio trabajo
terminado es `[CLAIMED]` — por muy seguro que esté. Solo un registro externo lo hace `[PROVEN]`:
un archivo en disco, el código de salida de un comando, una línea de registro escrita por algo
que no eres tú.

Por eso una fila `DONE` sin ruta de evidencia es inválida (véase
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). "Lo hice" es una afirmación. El archivo es la
prueba.

---

## 4. Mide dos veces para cualquier cosa de los peldaños 0–2

Una sola comprobación nunca certifica un estado de seguridad. Dos mediciones independientes antes
de cualquier afirmación de Prioridad 0, siempre.

**Vuelve a medir, nunca recuerdes.** Un árbol se agita bajo sesiones concurrentes — una ruta leída
al principio de un turno puede haber desaparecido al final. El estado solo se conoce desde el
disco en *esta* ejecución. Nunca arrastres "despejado" o "actual" desde un turno anterior, un
archivo de memoria o un resumen.

**Un recuento es una medición, no un hecho.** Vuelve a contar en el punto de uso. Nunca cites de
memoria un número de archivos, un número de agentes ni una versión.

---

## 5. Una llamada caída no es un hallazgo

Ante **pérdida de transporte** — fallo de DNS, conexión reiniciada, rechazada, tiempo de espera
agotado sin respuesta — reintenta la misma llamada de inmediato y repetidamente. Nunca escribas
"sin resultados" para una llamada que nunca llegó, y nunca rellenes el hueco de memoria.

**Una respuesta que llegó es una respuesta, no un reintento.** Un 403, un 404, un conjunto de
resultados vacío, un rechazo explícito — eso son datos. Reintentar contra un rechazo para obtener
otra respuesta es evasión de detección, y está vetado en el peldaño 2 sin importar de quién sea la
cuenta o la red en que se ejecute.

La distinción en una línea: *reintenta la llamada que nunca aterrizó; nunca reintentes la
respuesta que no te gustó.*

---

## 6. Los hallazgos negativos cuentan

"Comprobado X, no es un peligro" es lo que evita que las tres sesiones siguientes vuelvan a
comprobar X. Regístralo.

**Registra según aprendes, no al final.** Un hallazgo que solo se guarda en la memoria de trabajo
y después se pierde es indistinguible de un trabajo nunca hecho.

---

## 7. Las eliminaciones son la señal de integridad

Al verificar un árbol contra una línea base, el informe tiene tres clases — añadido, modificado,
eliminado. El crecimiento y las ediciones son agitación esperable. **Una eliminación es la línea
por la que merece la pena alarmarse.**

No vuelvas a fijar la línea base sobre trabajo concurrente sin auditar. Audita primero, sella
después.

---

## 8. La auditoría es un papel, no un estado de ánimo

Un auditor enumera cada agente, comando y mandato **desde el disco** y comprueba cada uno contra
clases fijas — contando tanto las comprobaciones limpias como los defectos. Una ejecución que no
despeja nada no ha auditado nada; solo ha recogido quejas.

**El auditor nunca arregla.** Los hallazgos se encaminan al proceso de corrección
([`05-CORRECTION.md`](05-CORRECTION.md)) o al agente propietario. Un auditor que repara lo que
encuentra ha destruido su propia evidencia y ya no se le puede confiar informar de una ejecución
limpia.

---

## 9. La regla a la que todas sirven

> Un hecho afirmado en seis archivos será erróneo en cinco de ellos.

La disciplina de evidencia es lo que hace que el sexto se pueda encontrar.
