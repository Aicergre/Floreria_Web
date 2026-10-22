
using Floreria.Models;

namespace Floreria.Data;

public static class FloreriaStore
{
    public static List<Categoria> Categorias { get; } = new();
    public static List<Producto> Productos { get; } = new();
    public static List<Proveedor> Proveedores { get; } = new();
    public static List<Compra> Compras { get; } = new();

    public static int NuevoId<T>(List<T> lista) where T : class
    {
        return lista.Count == 0
            ? 1
            : lista.Max(x => (int)x.GetType()
                .GetProperty("Id")!.GetValue(x)!) + 1;
    }
}
