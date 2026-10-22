
using Floreria.Models;
using Microsoft.EntityFrameworkCore;

namespace Floreria.Data;

public class FloreriaDbContext : DbContext
{
    public FloreriaDbContext(
        DbContextOptions<FloreriaDbContext> options)
        : base(options)
    {
    }

    public DbSet<Categoria> Categorias => Set<Categoria>();

    public DbSet<Producto> Productos => Set<Producto>();

    public DbSet<Proveedor> Proveedores => Set<Proveedor>();

    public DbSet<Compra> Compras => Set<Compra>();
}
