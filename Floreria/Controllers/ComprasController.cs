
using Floreria.Data;
using Floreria.Models;
using Microsoft.AspNetCore.Mvc;

namespace Floreria.Controllers;

[ApiController]
[Route("api/compras")]
public class ComprasController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar() =>
        Ok(FloreriaStore.Compras);

    [HttpGet("{id:int}")]
    public IActionResult Obtener(int id)
    {
        var compra = FloreriaStore.Compras
            .FirstOrDefault(c => c.Id == id);

        return compra is null ? NotFound() : Ok(compra);
    }

    [HttpPost]
    public IActionResult Crear(Compra compra)
    {
        if (compra.Total < 0)
            return BadRequest("El total no puede ser negativo.");

        if (!FloreriaStore.Proveedores.Any(
            p => p.Id == compra.ProveedorId))
            return BadRequest("El proveedor no existe.");

        compra.Id = FloreriaStore.NuevoId(
            FloreriaStore.Compras);

        compra.Fecha = DateTime.Now;

        FloreriaStore.Compras.Add(compra);

        return CreatedAtAction(
            nameof(Obtener),
            new { id = compra.Id },
            compra);
    }

    [HttpPut("{id:int}")]
    public IActionResult Actualizar(int id, Compra datos)
    {
        var compra = FloreriaStore.Compras
            .FirstOrDefault(c => c.Id == id);

        if (compra is null) return NotFound();

        if (datos.Total < 0)
            return BadRequest("El total no puede ser negativo.");

        if (!FloreriaStore.Proveedores.Any(
            p => p.Id == datos.ProveedorId))
            return BadRequest("El proveedor no existe.");

        compra.Total = datos.Total;
        compra.Estado = datos.Estado;
        compra.ProveedorId = datos.ProveedorId;

        return Ok(compra);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Eliminar(int id)
    {
        var compra = FloreriaStore.Compras
            .FirstOrDefault(c => c.Id == id);

        if (compra is null) return NotFound();

        FloreriaStore.Compras.Remove(compra);
        return NoContent();
    }
}
