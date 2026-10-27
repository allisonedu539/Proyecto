# Mundo Mágico: La Isla de las Emociones

Experiencia educativa interactiva para niñas y niños de 3 a 5 años, hecha con HTML, CSS y JavaScript sin frameworks ni dependencias de ejecución.

## Estructura

```text
proyecto/
├── index.html
├── styles.css
├── script.js
└── assets/
    └── lumi.svg
```

## Ejecutar en Visual Studio Code

1. Abre la carpeta del proyecto en Visual Studio Code.
2. Abre `index.html` en un navegador o usa la extensión Live Server y elige **Open with Live Server**.
3. Pulsa **Comenzar aventura**. La voz y los efectos de sonido tienen controles independientes en la barra superior; el navegador puede no tener voces en español instaladas.

## Jugar desde el terminal

La versión de terminal es independiente de la web y no utiliza imágenes, paquetes ni bibliotecas externas.

1. Abre el terminal integrado en Visual Studio Code desde **Terminal > Nuevo terminal**.
2. Desde la carpeta del proyecto, ejecuta:

   ```powershell
   python .\mundo_magico.py
   ```

3. Usa los números que aparecen en pantalla para recorrer el mapa y elegir las respuestas. Para la respiración, sigue la guía de Lumi y pulsa Enter cuando quieras continuar.

Si en tu instalación de Windows el comando `python` no está disponible, prueba `py .\mundo_magico.py`. La aventura de terminal guarda su progreso aparte en `mundo_magico_terminal.json`, sin cambiar el progreso del navegador. La opción de borrar progreso solicita confirmación.

El progreso se guarda en el almacenamiento local del navegador. La sección **Modo docente** muestra aventuras completadas, habilidades trabajadas e ideas para juegos presenciales. No almacena ni califica las respuestas emocionales. El botón de borrado elimina solo el progreso local después de confirmarlo.

No se necesitan imágenes externas para las ilustraciones. La fuente tipográfica puede descargarse desde Google Fonts; si no hay conexión, se usan fuentes alternativas instaladas en el sistema.

El mapa incluye un indicador animado para la siguiente isla disponible, y cada escenario tiene su propia iluminación y paisaje. Al completar una aventura aparece una lluvia de estrellas y se actualiza el cofre de premios. Las animaciones respetan la preferencia del dispositivo por reducir el movimiento.
