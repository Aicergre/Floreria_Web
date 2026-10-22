
using Floreria.Data;
using Floreria.Models;
using Microsoft.AspNetCore.Mvc;

namespace Floreria.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar() =>
        Ok(FloreriaStore.Productos);

    [HttpGet("{id:int}")]
    public IActionResult Obtener(int id)
    {
        var producto = FloreriaStore.Productos
            .FirstOrDefault(p => p.Id == id);

        return producto is null ? NotFound() : Ok(producto);
    }

    [HttpPost]
    public IActionResult Crear(Producto producto)
    {
        if (string.IsNullOrWhiteSpace(producto.Nombre))
            return BadRequest("El nombre es obligatorio.");

        if (producto.Precio < 0 || producto.Stock < 0)
            return BadRequest("Precio y stock no pueden ser negativos.");

        if (!FloreriaStore.Categorias.Any(
            c => c.Id == producto.CategoriaId))
            return BadRequest("La categoría no existe.");

        producto.Id = FloreriaStore.NuevoId(
            FloreriaStore.Productos);

        FloreriaStore.Productos.Add(producto);

        return CreatedAtAction(
            nameof(Obtener),
            new { id = producto.Id },
            producto);
    }

    [HttpPut("{id:int}")]
    public IActionResult Actualizar(int id, Producto datos)
    {
        var producto = FloreriaStore.Productos
            .FirstOrDefault(p => p.Id == id);

        if (producto is null) return NotFound();

        if (string.IsNullOrWhiteSpace(datos.Nombre))
            return BadRequest("El nombre es obligatorio.");

        if (datos.Precio < 0 || datos.Stock < 0)
            return BadRequest("Precio y stock no pueden ser negativos.");

        if (!FloreriaStore.Categorias.Any(
            c => c.Id == datos.CategoriaId))
            return BadRequest("La categoría no existe.");

        producto.Nombre = datos.Nombre;
        producto.Descripcion = datos.Descripcion;
        producto.Precio = datos.Precio;
        producto.Stock = datos.Stock;
        producto.ImagenUrl = datos.ImagenUrl;
        producto.Disponible = datos.Disponible;
        producto.CategoriaId = datos.CategoriaId;

        return Ok(producto);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Eliminar(int id)
    {
        var producto = FloreriaStore.Productos
            .FirstOrDefault(p => p.Id == id);

        if (producto is null) return NotFound();

        FloreriaStore.Productos.Remove(producto);
        return NoContent();
    }
}
