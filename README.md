
# Biblioteca en Línea - CRUD con Express y TypeScript

Este proyecto es una aplicación de biblioteca en línea que permite gestionar usuarios y libros, así como reservar libros. Utiliza Express para el backend y TypeScript para el desarrollo, con almacenamiento en archivos JSON.


## Funcionalidades

- Crear, leer, actualizar y eliminar usuarios.
- Crear, leer, actualizar y eliminar libros.



## Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución para JavaScript del lado del servidor.
- **Express:** Framework para aplicaciones web en Node.js.
- **TypeScript:** Superset de JavaScript con tipado estático.
- **Swagger:** Documentación de API, puede consultarse en /api-docs.
- **JSON:** Formato de almacenamiento de datos.
## Lanzar en local

Clona el proyecto

```bash
  git clone https://github.com/PMFrancisco/auj-backend
```

Ve al directorio del proyecto

```bash
  cd auj-backend
```

Instala dependencias

```bash
  npm install
```

Inicia el servidor

```bash
  npm run start
```


## Rutas de la API

### Usuarios

#### Obtén todos los usuarios

```http
  GET /users
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `N/A` | `N/A` | No hay parametros necesarios |

#### Obtén un usuario por ID

```http
  GET /users/${id}
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del usuario a obtener |

#### Crea un nuevo usuario

```http
  POST /users
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `name`      | `string` | **Requerido**. Nombre del usuario |
| `email`      | `string` | **Requerido**. Email del usuario |

#### Actualiza un usuario

```http
  PUT /users/${id}

```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del usuario a actualizar |
| `name`      | `string` | **Opcional**. Nombre actualizado del usuario |
| `email`      | `string` | **Opcional**. Email actualizado del usuario |

#### Elimina un usuario

```http
  DELETE /users/${id}
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del usuario a eliminar |

### Libros

#### Obtén todos los libros

```http
  GET /books
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `N/A` | `N/A` | No hay parametros necesarios |

#### Obtén un usuario por ID

```http
  GET /books/${id}
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del libro a obtener |

#### Crea un nuevo libro

```http
  POST /libros
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `title`      | `string` | **Requerido**. Título del libro |
| `author`      | `string` | **Requerido**. Autor del libro |
| `publishedDate`      | `string` | **Opcional**. Fecha de publicación en formato YYYY-MM-DD |
| `isbn`      | `string` | **Opcional**. ISBN del libro |
| `genre`      | `string` | **Opcional**. Género del libro |

#### Actualiza un libro

```http
  PUT /libro/${id}

```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del libro a actualizar |
| `title`      | `string` | **Opcional**. Título del libro actualizado |
| `author`      | `string` | **Opcional**. Autor del libro actualizado |
| `publishedDate`      | `string` | **Opcional**. Fecha de publicación en formato YYYY-MM-DD actualizada |
| `isbn`      | `string` | **Opcional**. ISBN del libro actualizado |
| `genre`      | `string` | **Opcional**. Género del libro actualizado |

#### Prestar un libro a un usuario

```http
  POST /books/${id}/lend
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `userId`      | `string` | **Requerido**. Id del usuario a quien se prestará el libro |

#### Devolver un libro de un usuario

```http
  POST /books/${id}/return
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `userId`      | `string` | **Requerido**. Id del usuario que devuelve el libro |

#### Elimina un libro

```http
  DELETE /books/${id}
```

| Parametro | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Requerido**. Id del libro a eliminar |

## Contribuciones

[Ekaterina Kushnir](https://github.com/katiaku) - Resolución de la [Issue 1](https://github.com/PMFrancisco/auj-backend/issues/1), consistente en crear un Endpoint para la devolución de librosl.