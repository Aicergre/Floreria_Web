
using Microsoft.AspNetCore.Mvc;

namespace Floreria.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PruebaController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            mensaje = "La API de la florería funciona correctamente",
            estado = "OK"
        });
    }
}
