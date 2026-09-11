> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 05 — CORRECCIÓN

**Estado: normativo.** Qué ocurre cuando un hecho registrado resulta ser erróneo.

---

## 1. El problema

> Un hecho afirmado en seis archivos será erróneo en cinco de ellos.

Corregir el archivo que casualmente tienes delante no es una corrección. Crea un árbol donde la
verdad y el error tienen ambos citas, y la sesión siguiente elige el que abra primero. Este es el
modo de fallo que define a una flota de agentes cargada de documentación, y se agrava en
silencio.

**Una corrección se propaga, o no ocurrió.**

---

## 2. Leer no es gratis — obliga

Leer un archivo rector te pone bajo él. De ahí se siguen dos cosas:

1. Todo lo que contenga que sea **duradero, no obvio y no derivable del árbol** pasa a tu memoria
   persistente antes de que la sesión termine.
2. **Si tu contexto contradice al archivo, gana el archivo.** No lo sortees. Corrige el registro.

---

## 3. Corrección Inmediata de Rumbo (ICC)

Un comando, un turno, sin paso de propuesta.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### La secuencia

**1 · Barrido.** Deriva de la corrección entre 2 y 5 términos de búsqueda: la redacción
**antigua**, sus variantes obvias y los nombres propios implicados. No la redacción nueva. Ejecuta
un barrido indexado por término antes de leer nada. Nunca recorras el árbol archivo por archivo
para encontrar coincidencias — para eso está el índice.

**2 · Clasifica cada coincidencia.**

| Coincidencia | Acción |
|---|---|
| **Afirma el hecho antiguo** | Reescríbela. |
| **Lo menciona de pasada**, cierto en cualquier caso | Déjala. No agites la prosa. |
| **Contradice el hecho nuevo de forma indirecta** — una conclusión derivada, una fila de tabla, un trabajo programado construido sobre el valor antiguo | **Reescríbela también.** Esta es la que más a menudo se pasa por alto. |
| **Fuera de límites** (§5) | Nunca la edites. Anótala en *Left alone*. |

**3 · Reescribe, todo de una vez.** Ajústate a la voz existente de cada archivo y a su convención
de etiquetas de confianza. Un hecho corregido conserva la etiqueta que se gane — **no promuevas
una afirmación a `[PROVEN]` porque ahora esté vigente.** Si el texto antiguo llevaba fecha, pon
la de hoy.

Cuando un hecho se afirma en más de tres archivos, eso es **duplicación, no redundancia**:
enúncialo una vez en el archivo que lo posee, y haz que los demás apunten allí.

**4 · Libro mayor y memoria.** Ambos, o la ejecución no ha terminado. Antepón una entrada al libro
mayor de correcciones:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Después escribe el hecho en la memoria persistente — **comprobando primero si ya existe una
memoria sobre el asunto y actualizando esa**, en vez de dejar dos versiones de un hecho que
acabas de dedicar un comando a unificar.

**5 · Obligaciones posteriores a la edición.** Vuelve a ejecutar el generador o la copia de
seguridad que las ediciones hayan obligado. Reconstruye el índice si se crearon o borraron
archivos.

---

## 4. Una decisión permanente se revierte a la vista

Si una corrección invalida una decisión permanente — una línea de "no volver a litigar", un
elemento `[PROVEN]`, una regla de política — **no la cambies en silencio.** Reescríbela como
*revertida*, con la fecha y el motivo, para que la sesión siguiente sepa que fue anulada y no
olvidada.

Una decisión que cambia sin dejar rastro es indistinguible de una decisión que nunca se tomó.

---

## 5. Lo que nunca se reescribe

| Nunca se toca | Por qué |
|---|---|
| `backups/`, `archive/` | Historia. La historia no se corrige; se supera. |
| Archivos generados | Edita la fuente y vuelve a ejecutar el generador. |
| El árbol de un agente aislado | Acceso solo por nombre. |
| El contexto maestro autoritativo de otra raíz | Informa de la desviación. No edites cruzando una frontera de propiedad. |
| Cualquier cosa que contenga un secreto | Totalmente fuera del alcance de un barrido de texto. |

**Un barrido que reescribe texto destruirá binarios.** Acota cada barrido a extensiones de texto
por lista de permitidos, nunca por exclusión.

---

## 6. Lo que ICC no hace

`/icc` corrige el registro. **No va después a hacer el trabajo que la corrección implica.** Son
actos separados con autorizaciones separadas, y confundirlos es como una corrección de una línea
se convierte en una refactorización no revisada.

---

## 7. Los hechos rivales se zanjan y se podan — no se catalogan

Cuando dos archivos afirman hechos contradictorios, **decide cuál es el correcto, consérvalo y
elimina las afirmaciones erróneas en el mismo pase.**

Un informe de conflicto que deja ambos rivales en disco no ha resuelto nada. La sesión siguiente
sigue eligiendo el archivo que abra primero, y una regla de seguridad con cinco versiones en
circulación es *menos* fiable que una con una sola versión, no más.

**Decide por el fondo, nunca por marca de tiempo.** El ganador es el archivo que posee el hecho,
la versión respaldada por una medición, la que sobrevive al escrutinio. **Lo más nuevo no es lo
más cierto** — el fallo canónico aquí son cuatro archivos de memoria duplicados escritos con
noventa segundos de diferencia, donde el más nuevo afirmaba la afirmación falsa, de modo que una
regla de "gana el más nuevo" habría heredado el error.

**Registra la resolución.** Qué hecho ganó, qué se podó y por qué — en el libro mayor, para que la
poda sea legible en lugar de silenciosa. Un rival que se desvanece sin dejar rastro parece
idéntico a un rival que nunca estuvo, y la sesión siguiente lo vuelve a crear.

### Lo que aun así se escala en vez de zanjarse

Tres casos. Exponlos; no los decidas:

- La contradicción depende de información que el agente no tiene.
- Equivocarse sería **inseguro o irreversible** — cualquier cosa de los peldaños 0–2.
- La afirmación perdedora queda **fuera de la frontera de propiedad del agente** — el contexto
  maestro autoritativo de otra raíz. Informa de la desviación; no edites cruzando la frontera.

Todo lo ordinario se decide y se limpia.
