Instrucciones para ejecutar la aplicación
Requisitos previos
Node.js instalado en su computadora.
JRE (Java Runtime Environment) instalado en su computadora.
Dependencias instaladas (ejecuta npm install en la carpeta del proyecto para comprobar su existencia en su equipo).
Ejecución de la aplicación
Clona el repositorio con GitHub. Link: 
Copia el directorio del repositorio incluida la carpeta ssl-antlr-Language.
Abre una terminal y luego coloca cd + (el directorio que copiaste recientemente):
cd C:\...\ssl-antrl-Language
Asegúrate de que los archivos de entrada (inputs) correctos e incorrectos estén presentes.
Elige una entrada con un input correcto. Esto es esencial, ya que el analizador funciona correcto.
Colocar en la terminal "node index.js" . En caso de que se trate de una entrada válida, deberías poder ver en la pantalla:
Análisis léxico y sintáctico sobre el código fuente junto con la información de si la entrada es correcta o contiene errores. En caso de errores, la indicación de la línea en la que ocurren y la causa del problema.

Tabla de lexemas-tokens reconocidos durante el análisis léxico. (En caso de ser válida)

Árbol de análisis sintáctico. Puede verse graficamente o en formato de texto. (En caso de ser válida)

La salida del código fuente (input.txt) en lenguaje JavaScript y la ejecutación de como lo haría un interprete básico. (En caso de ser válida)

Nota:
Si deseas probar con otro archivo de entrada, puedes volver a colocar en la terminal "node index.js" y escoger otro input distinto al elegido anteriormente.
