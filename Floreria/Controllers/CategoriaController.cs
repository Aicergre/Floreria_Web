
using Floreria.Data;
using Floreria.DTOs;
using Floreria.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Floreria.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly FloreriaDbContext _context;

    public CategoriaController(FloreriaDbContext context)
    {
        _context = context;
    }

    // GET: api/Categoria
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetCategorias()
    {
        var categorias = await _context.Categorias
            .AsNoTracking()
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.Descripcion,
                c.Activa
            })
            .ToListAsync();

        return Ok(categorias);
    }

    // GET: api/Categoria/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>> GetCategoria(int id)
    {
        var categoria = await _context.Categorias
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.Descripcion,
                c.Activa
            })
            .FirstOrDefaultAsync();

        if (categoria == null)
            return NotFound(new { mensaje = "Categoría no encontrada." });

        return Ok(categoria);
    }

    // POST: api/Categoria
    [HttpPost]
    public async Task<ActionResult> CrearCategoria(
        CategoriaCreateDto dto)
    {
        var categoria = new Categoria
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Activa = dto.Activa
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCategoria),
            new { id = categoria.Id },
            new
            {
                categoria.Id,
                categoria.Nombre,
                categoria.Descripcion,
                categoria.Activa
            });
    }

    // PUT: api/Categoria/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarCategoria(
        int id,
        CategoriaUpdateDto dto)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound(new { mensaje = "Categoría no encontrada." });

        categoria.Nombre = dto.Nombre;
        categoria.Descripcion = dto.Descripcion;
        categoria.Activa = dto.Activa;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Categoria/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound(new { mensaje = "Categoría no encontrada." });

        var tieneProductos = await _context.Productos
            .AnyAsync(p => p.CategoriaId == id);

        if (tieneProductos)
        {
            return Conflict(new
            {
                mensaje = "No se puede eliminar la categoría porque tiene productos asociados."
            });
        }

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
