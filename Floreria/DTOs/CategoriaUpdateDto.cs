
using System.ComponentModel.DataAnnotations;

namespace Floreria.DTOs;

public class CategoriaUpdateDto
{
    [Required]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Descripcion { get; set; }

    public bool Activa { get; set; }
}
