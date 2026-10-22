
using System.ComponentModel.DataAnnotations;

namespace Floreria.Models;

public class Proveedor
{
    public int Id { get; set; }

    [Required]
    [StringLength(120)]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(20)]
    public string? Telefono { get; set; }

    [EmailAddress]
    public string? Correo { get; set; }

    [StringLength(200)]
    public string? Direccion { get; set; }

    public ICollection<Compra> Compras { get; set; }
        = new List<Compra>();
}
