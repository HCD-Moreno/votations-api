## 1 - Instalación de dependencias

Para poder trabajar con el proyecto es necesario instalar las dependencias:

```bash
$ npm install
```

Luego de esto generará una carpeta node_modules en la carpeta raiz.

## 2 - Base de Datos y Variables de entorno

Despues de crear la base de datos y subirla deberas crear un archivo .env tomando como ejemplo el archivo .env-sample en la carpeta raiz del proyecto y completar ahi todos los datos para conectar la base de datos

## 3 - Compilación

Para generar una compilación del proyecto basta con

```bash
$ npm run build
```

No olvide crear una copia de su .env en la raiz de su compilación para leer las variables de entorno.
