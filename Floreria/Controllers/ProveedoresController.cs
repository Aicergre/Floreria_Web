
using Floreria.Data;
using Floreria.Models;
using Microsoft.AspNetCore.Mvc;

namespace Floreria.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedoresController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar() =>
        Ok(FloreriaStore.Proveedores);

    [HttpGet("{id:int}")]
    public IActionResult Obtener(int id)
    {
        var proveedor = FloreriaStore.Proveedores
            .FirstOrDefault(p => p.Id == id);

        return proveedor is null ? NotFound() : Ok(proveedor);
    }

    [HttpPost]
    public IActionResult Crear(Proveedor proveedor)
    {
        if (string.IsNullOrWhiteSpace(proveedor.Nombre))
            return BadRequest("El nombre es obligatorio.");

        proveedor.Id = FloreriaStore.NuevoId(
            FloreriaStore.Proveedores);

        FloreriaStore.Proveedores.Add(proveedor);

        return CreatedAtAction(
            nameof(Obtener),
            new { id = proveedor.Id },
            proveedor);
    }

    [HttpPut("{id:int}")]
    public IActionResult Actualizar(int id, Proveedor datos)
    {
        var proveedor = FloreriaStore.Proveedores
            .FirstOrDefault(p => p.Id == id);

        if (proveedor is null) return NotFound();

        if (string.IsNullOrWhiteSpace(datos.Nombre))
            return BadRequest("El nombre es obligatorio.");

        proveedor.Nombre = datos.Nombre;
        proveedor.Telefono = datos.Telefono;
        proveedor.Correo = datos.Correo;
        proveedor.Direccion = datos.Direccion;

        return Ok(proveedor);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Eliminar(int id)
    {
        var proveedor = FloreriaStore.Proveedores
            .FirstOrDefault(p => p.Id == id);

        if (proveedor is null) return NotFound();

        if (FloreriaStore.Compras.Any(c => c.ProveedorId == id))
            return Conflict("El proveedor tiene compras asociadas.");

        FloreriaStore.Proveedores.Remove(proveedor);
        return NoContent();
    }
}
