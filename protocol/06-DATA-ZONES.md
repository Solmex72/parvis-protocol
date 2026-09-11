> **Traducción no oficial.** La versión normativa de este documento es la inglesa, en la rama `main`.
> Esta traducción se ofrece por comodidad y **no ha sido verificada por un hablante nativo**. Si
> difiere del original en inglés, **prevalece el inglés**. Los identificadores del protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, los verbos del bus y los nombres de archivo)
> se conservan en inglés de forma deliberada: son valores literales que los agentes analizan.

# 06 — ZONAS DE DATOS

**Estado: normativo.** Dónde se le permite vivir a un archivo.

---

## 1. Por qué una prohibición no funcionó

La regla original era *"sin secretos, nunca, en ningún sitio"* — **sin ningún lugar donde poner
los datos privados en su lugar.**

Una prohibición sin destino no se cumple. Se sortea, y el material privado acaba en el árbol
sincronizado por accidente. Eso ocurrió repetidamente, incluso por parte de un agente que estaba
él mismo bajo la regla.

**La regla es una decisión de encaminamiento, no una prohibición.**

---

## 2. Las dos zonas

| Zona | Propiedad | Contiene |
|---|---|---|
| **PUBLIC** | Se sincroniza con almacenamiento en la nube. **Trata cada byte como publicado.** | Doctrina, mandatos, definiciones de agentes, arquitectura, contexto de negocio, investigación, documentación técnica |
| **PRIVATE** | **Fuera de toda raíz de sincronización** — y fuera del perfil de usuario, para que la redirección de carpetas conocidas tampoco pueda alcanzarla | Secretos, personas reales y sus datos personales, proyectos y medios privados, cualquier cosa que estaría mal encontrar en una copia de seguridad |

### La prueba

> *¿Sería un problema que esto estuviera en una instantánea en la nube dentro de un año?*

Sí → PRIVATE. No → PUBLIC. Cuando haya duda real → **PRIVATE.** El coste de sobreclasificar es la
incomodidad. El coste de infraclasificar no se puede deshacer.

### Sepas qué se sincroniza de verdad

Compruébalo en la máquina real, no por suposición. En una estación de trabajo típica pueden estar
ejecutándose varios clientes de sincronización a la vez, y cualquier cosa bajo las carpetas de
documentos, escritorio o imágenes del usuario sale de la máquina y se retiene en el historial de
versiones durante semanas. **Borrarlo en local no lo revoca.**

Dos consecuencias que causan fallos reales cada una:

1. **La salida de compilación debe redirigirse** fuera de una raíz de sincronización, o el espejo
   la corrompe a mitad de compilación.
2. **Las claves viven fuera**, de forma deliberada y por defecto.

---

## 3. La excepción: las credenciales no son de ninguna zona

**Las credenciales vivas — contraseñas, claves de API, tokens, claves de emisión — pertenecen a un
gestor de contraseñas, no a ninguno de los dos sistemas de archivos.**

La zona privada contiene *datos privados*. Un gestor de contraseñas contiene *credenciales*. Esto
no es pedantería: un directorio privado no está cifrado por defecto, y un archivo es un archivo.
En el momento en que uno se copia, se cita en una transcripción o se adjunta a algo, queda
divulgado.

**Enuncia la propiedad de seguridad de la zona privada de forma estrecha y nunca la exageres.** Su
única propiedad probada suele ser que *nada la copia a ningún sitio*. A falta de cifrado
verificado de disco completo o por archivo, no está cifrada, ni respaldada, ni es una caja fuerte.

---

## 4. La clasificación es del Operador, y es ajustable

Mantén la tabla viva en un solo archivo — `DATA-CLASSIFICATION.md` — donde el Operador mueve
categorías entre zonas y cada agente lo lee en vez de adivinar.

Este archivo de protocolo enuncia el **mecanismo**. Ese archivo enuncia la **política**. Cuando
ambos discrepen, gana el archivo de política.

---

## 5. Consecuencias para los agentes

- **Ningún secreto en ningún árbol que se empaquete.** Un paquete de contexto existe para pegarse
  en una sesión nueva. Nombra qué se guarda y dónde; nunca el valor.
- **Ningún secreto llega a `surface/`.** Se muestra en pantalla.
- **Ningún secreto llega a un navegador.** Véase [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Redacta por referencia, no por borrado.** `<api key — see password manager entry "acme-prod">`
  mantiene el hecho localizable sin divulgar el valor.

---

## 6. Podar sin perder

Antes de que algo salga del árbol de trabajo:

1. Cópialo a un almacén sellado **fuera de las raíces** — un archivo comprimido, no alcanzable por
   glob.
2. Prepara las rutas en `marked-deletion.md` / `marked-archive.md`.
3. **La ejecución es la mano del Operador**, con el árbol aquietado.

Nunca borres en masa bajo concurrencia en vivo.
