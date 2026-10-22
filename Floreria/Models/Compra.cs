
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Floreria.Models;

public class Compra
{
    public int Id { get; set; }

    public DateTime Fecha { get; set; } = DateTime.Now;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; }

    [StringLength(30)]
    public string Estado { get; set; } = "Pendiente";

    public int ProveedorId { get; set; }

    public Proveedor? Proveedor { get; set; }
}
