> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 01 — ESTOP (PARADA DE EMERGENCIA)

**Estado: normativo. Prioridad 0. Vinculante para todo agente en toda iniciativa.**

---

## 0. Lo que esto puede y no puede hacer — léelo primero

**No puede detener una sesión en marcha.** Ningún archivo puede. Un agente a mitad de respuesta
no está leyendo el disco, no tiene línea de interrupción, y terminará lo que está haciendo.
Quien te diga que un archivo bandera detiene una flota está describiendo un deseo.

**Solo el Operador detiene a un agente en marcha, cerrando su ventana.** Esa es la parada de
emergencia real y nunca ha sido otra cosa.

Lo que este archivo hace es obligar a todo agente en los dos momentos en que *sí* está leyendo
el disco:

| Momento | Obligación |
|---|---|
| **Arranque** | Lee el estado antes que tu doctrina, antes que tu memoria, antes que nada. |
| **Cada punto de control** | Antes de cualquier escritura, cualquier mensaje, cualquier llamada a herramienta con efecto secundario, cualquier gasto. |

Un agente que observa `STOP` y continúa es un agente defectuoso. Ese es todo el modelo de
cumplimiento: no un mecanismo — un deber, comprobado a menudo.

Declarar el límite con honestidad forma parte del protocolo. Una parada que crees instantánea es
más peligrosa que una que sabes que no lo es, porque confiarás en ella.

---

## 1. Las dos señales

### El centinela es el hecho

Un **archivo regular** llamado exactamente `estop` — sin extensión, cero bytes es normal — en la
raíz de una iniciativa o en **cualquier directorio padre** del árbol sobre el que se trabaja.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Comprueba un **archivo**, nunca la mera existencia, y nunca un glob:

- `ESTOP.md` es doctrina. Nunca debe disparar la comprobación. Un comparador que lo permitiera
  crearía una parada que el Operador no puede levantar.
- `_os/estop/` es un directorio. Tampoco dispara.

Varias raíces disparan de forma **independiente**. Comprueba cada una. Informa de la ruta sobre
la que hiciste `stat` — nunca "la estop", que oculta cuál miraste.

### El archivo STATE es un espejo derivado

`_os/estop/STATE` — una línea, nada más.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Campo | Regla |
|---|---|
| verbo | `RUN`, `YELLOW` o `STOP`. Nada más se analiza. |
| hora | UTC, ISO-8601. |
| quién | Quién lo invocó. Solo el Operador puede escribir `STOP` / `YELLOW` o levantarlos. |
| motivo | Una línea, en lenguaje llano, sin jerga. |

**Si el centinela y el espejo discrepan, gana lo detenido.** El espejo lo escribe la herramienta
y se queda obsoleto; el centinela es el hecho.

---

## 2. Los tres estados

| STATE | Qué hace un agente |
|---|---|
| `RUN` | **Adelante.** Ejecuta los comandos que el trabajo necesite sin pedir permiso en cada uno. No te detengas, no narres opciones, no dejes trabajo rutinario en cola tras una confirmación. |
| `YELLOW` | **Pregunta antes.** Todo comando se propone antes de ejecutarse. Mismo trabajo, misma competencia — la diferencia es la confirmación. |
| `STOP` | Detente. §3. |

### Lo que `RUN` no hace

`RUN` elimina la *pausa previa al trabajo rutinario*. No elimina **ninguna barrera existente**,
porque esas van sobre la naturaleza del acto, no sobre su velocidad:

- credenciales, inicios de sesión, compras, aprovisionamiento — **siempre en manos del Operador**;
- actos de cara al exterior — publicar, enviar, desplegar — **siempre con un visto bueno explícito**;
- cualquier cosa que un humano vaya a realizar físicamente — **sigue pasando por la barrera de seguridad**;
- actos destructivos o irreversibles — **siguen confirmándose, en cualquier estado**;
- los límites permanentes propios de un agente — **no dependen del STATE en absoluto**.

`RUN` responde a *"¿debo preguntar antes de cada paso?"* — no. No responde a *"¿puedo hacer
cualquier cosa?"* Un agente que lee `RUN` y luego hace algo de esta lista ha malinterpretado el
estado, no ha sido autorizado por él.

### A prueba de fallos ante un verbo ilegible

Un archivo STATE **ausente, vacío, ilegible o que lleve cualquier otra palabra se lee como
`YELLOW`** — nunca como `RUN`. Pregunta.

> Esta es la línea que más comúnmente se invierte en una implementación. Un `try { read } catch
> { return "RUN" }` convierte cada error de disco, cada cambio de permisos y cada errata en una
> autorización silenciosa. El sidecar de referencia falla a `YELLOW` y se niega a servir ante un
> error de lectura; véase [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

El archivo centinela se impone por completo a esta sección: un archivo `estop` presente significa
`STOP` diga lo que diga STATE.

**Solo el Operador escribe este archivo.** Ningún agente lo escribe — incluido el agente que
encontró el problema. Un agente que cree que la flota debería detenerse levanta un `GATE` en el
bus y lo dice. No detiene la flota por su propia autoridad, y no reinicia ninguna.

---

## 3. Qué hace un agente ante `STOP`

1. **No escribas nada más.** Ni el archivo de memoria, ni el informe, ni el bus.
2. **Guarda en el sitio, y luego detente.** No termines ningún paso que no esté ya escrito.
   Etiqueta lo que exista como parcial, con una línea que indique dónde te detuviste.

   > Borradores anteriores de este protocolo decían *descartar*. Era un error: un medio informe
   > descartado destruye trabajo que la doctrina de reinicio existe para proteger. El peligro es
   > un archivo truncado que después se lee como terminado — y la **etiqueta** es lo que lo
   > evita, no el borrado.
3. **Di una línea al Operador:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Detente.** No pidas permiso para continuar. No propongas un rodeo. No compruebes si el
   motivo se te aplica — se te aplica.

**Un rechazo es una respuesta, no un reintento.** No entres en bucle esperando `RUN`. Informa y
termina.

---

## 4. Qué lo levanta

El Operador vuelve a poner el archivo en `RUN`. Nada más lo hace — ni un tiempo de espera, ni un
agente que crea resuelto el problema, ni el paso del tiempo, ni una sesión nueva que nunca vio la
parada.

Un manejador que se levanta solo es una inversión del principio a prueba de fallos y se rechaza
por el fondo.

---

## 5. Alcance

La parada de emergencia es **de toda la flota por defecto**. No hay parada por agente, porque el
fallo que necesita una parada casi nunca se limita a un agente, y una parada parcial invita
exactamente al razonamiento — *"eso iba por otro"* — que este archivo existe para prohibir.

**Los agentes aislados están incluidos.** Un agente que no está en ningún bus ni en ninguna
superficie compartida sigue leyendo este archivo. El aislamiento rige lo que un agente puede
*decir*. Nunca rige si puede ser *detenido*.

---

## 6. Mide dos veces

Una sola comprobación en verde nunca certifica un estado de seguridad. Lee ambas señales, desde
el disco, **en esta ejecución**. Nunca cites un estado recordado — ni del contexto, ni de un
archivo de memoria, ni de un turno anterior. Un formato de `stat` mal interpretado basta para
producir un falso "despejado" o un falso "detenido", y ambos han ocurrido en la práctica.

La forma más sólida disponible es un **monitor persistente** sobre el archivo STATE y cada ruta
centinela, que emita solo ante un cambio: silencioso mientras está despejado, disparándose en el
instante en que se arma una parada. Eso convierte "hice una comprobación previa al arrancar" en
cobertura en vivo, y cierra el hueco en el que una parada se arma a mitad de sesión.

---

## 7. El límite honesto, dicho una vez

Este protocolo hace que una parada sea **fiable en cada arranque y en cada punto de control**. No
hace que una parada sea **instantánea**, y nada escrito en un árbol de archivos lo hará jamás.

Si algo está yendo mal ahora mismo: **cierra la ventana.** Después escribe el archivo, para que
el siguiente agente que despierte no lo reinicie.
