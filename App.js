
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';

const PRODUCTOS = [
  { id: 1, nombre: 'Ramo de Rosas Rojas', precio: 120, icono: '🌹' },
  { id: 2, nombre: 'Ramo de Girasoles', precio: 90, icono: '🌻' },
  { id: 3, nombre: 'Tulipanes Rosados', precio: 150, icono: '🌷' },
  { id: 4, nombre: 'Arreglo Floral Mixto', precio: 180, icono: '💐' },
];

function Boton({ texto, accion, secundario = false }) {
  return (
    <TouchableOpacity
      style={[styles.boton, secundario && styles.botonSecundario]}
      onPress={accion}
    >
      <Text style={[
        styles.textoBoton,
        secundario && styles.textoSecundario
      ]}>
        {texto}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const validarCorreo = (texto) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
  };

  const registrarUsuario = () => {
    if (!nombre.trim() || !correo.trim() ||
        !contrasena || !confirmarContrasena) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    if (nombre.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!validarCorreo(correo.trim())) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    if (contrasena.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    Alert.alert(
      'Validación correcta',
      'El formulario está correcto. Falta conectar el registro con la API.',
      [{
        text: 'Aceptar',
        onPress: () => {
          setContrasena('');
          setConfirmarContrasena('');
          setPantalla('login');
        }
      }]
    );
  };

  const iniciarSesion = () => {
    if (!correo.trim() || !contrasena) {
      Alert.alert('Error', 'Ingresa tu correo y contraseña.');
      return;
    }

    if (!validarCorreo(correo.trim())) {
      Alert.alert('Error', 'El correo no es válido.');
      return;
    }

    Alert.alert(
      'Modo demostración',
      'La autenticación estará disponible cuando conectemos la API.',
      [
        { text: 'Cancelar' },
        {
          text: 'Ver catálogo',
          onPress: () => setPantalla('catalogo')
        }
      ]
    );
  };

  const agregarCarrito = (producto) => {
    setCarrito((anterior) => {
      const existe = anterior.find(p => p.id === producto.id);

      if (existe) {
        return anterior.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...anterior, { ...producto, cantidad: 1 }];
    });

    Alert.alert('Carrito', 'Producto agregado correctamente.');
  };

  const cambiarCantidad = (id, cambio) => {
    setCarrito(anterior =>
      anterior
        .map(p =>
          p.id === id
            ? { ...p, cantidad: p.cantidad + cambio }
            : p
        )
        .filter(p => p.cantidad > 0)
    );
  };

  const total = carrito.reduce(
    (suma, p) => suma + p.precio * p.cantidad,
    0
  );

  const confirmarPedido = () => {
    if (carrito.length === 0) {
      Alert.alert('Aviso', 'Tu carrito está vacío.');
      return;
    }

    const pedido = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      productos: carrito.map(p => ({ ...p })),
      total,
      estado: 'Pendiente',
    };

    setPedidos(anterior => [pedido, ...anterior]);
    setCarrito([]);
    setPantalla('pedidos');

    Alert.alert(
      'Pedido de prueba',
      'Pedido registrado temporalmente. Falta conectar la API.'
    );
  };

  if (pantalla === 'inicio') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centro}>
          <Text style={styles.logo}>🌸</Text>
          <Text style={styles.titulo}>Florería Bella Flor</Text>
          <Text style={styles.subtitulo}>
            Flores para cada ocasión
          </Text>

          <Boton
            texto="Iniciar sesión"
            accion={() => setPantalla('login')}
          />

          <Boton
            texto="Registrarse"
            secundario
            accion={() => setPantalla('registro')}
          />

          <Boton
            texto="Ver catálogo"
            secundario
            accion={() => setPantalla('catalogo')}
          />
        </View>
      </View>
    );
  }

  if (pantalla === 'registro') {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.formulario}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>🌺</Text>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>
            Registro de clientes
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={correo}
            onChangeText={setCorreo}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña (mínimo 8 caracteres)"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
          />

          <Boton
            texto="Validar registro"
            accion={registrarUsuario}
          />

          <Boton
            texto="Ya tengo una cuenta"
            secundario
            accion={() => setPantalla('login')}
          />

          <Boton
            texto="Volver al inicio"
            secundario
            accion={() => setPantalla('inicio')}
          />

          <Text style={styles.aviso}>
            Registro de demostración. Los datos todavía
            no se envían al servidor.
          </Text>
        </ScrollView>
      </View>
    );
  }

  if (pantalla === 'login') {
    return (
      <View style={styles.container}>
        <View style={styles.centro}>
          <Text style={styles.logo}>🌷</Text>
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>
            Bienvenido a Bella Flor
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />

          <Boton
            texto="Ingresar (demostración)"
            accion={iniciarSesion}
          />

          <Boton
            texto="Crear cuenta"
            secundario
            accion={() => setPantalla('registro')}
          />

          <Boton
            texto="Volver al inicio"
            secundario
            accion={() => setPantalla('inicio')}
          />

          <Text style={styles.aviso}>
            Falta conectar la autenticación con la API.
          </Text>
        </View>
      </View>
    );
  }

  if (pantalla === 'catalogo') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.lista}>
          <Text style={styles.titulo}>Catálogo de flores</Text>
          <Text style={styles.subtitulo}>
            Nuestros arreglos florales
          </Text>

          {PRODUCTOS.map(producto => (
            <View key={producto.id} style={styles.tarjeta}>
              <Text style={styles.iconoProducto}>
                {producto.icono}
              </Text>

              <Text style={styles.nombreProducto}>
                {producto.nombre}
              </Text>

              <Text style={styles.precio}>
                Bs {producto.precio}
              </Text>

              <Boton
                texto="Agregar al carrito"
                accion={() => agregarCarrito(producto)}
              />
            </View>
          ))}

          <Boton
            texto={`Ver carrito (${carrito.reduce(
              (suma, p) => suma + p.cantidad, 0
            )})`}
            accion={() => setPantalla('carrito')}
          />

          <Boton
            texto="Mis pedidos"
            secundario
            accion={() => setPantalla('pedidos')}
          />

          <Boton
            texto="Volver al inicio"
            secundario
            accion={() => setPantalla('inicio')}
          />
        </ScrollView>
      </View>
    );
  }

  if (pantalla === 'carrito') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.lista}>
          <Text style={styles.titulo}>Mi carrito</Text>

          {carrito.length === 0 ? (
            <Text style={styles.subtitulo}>
              Todavía no agregaste productos.
            </Text>
          ) : (
            carrito.map(p => (
              <View key={p.id} style={styles.tarjeta}>
                <Text style={styles.iconoProducto}>
                  {p.icono}
                </Text>

                <Text style={styles.nombreProducto}>
                  {p.nombre}
                </Text>

                <Text style={styles.precio}>
                  Bs {p.precio * p.cantidad}
                </Text>

                <View style={styles.fila}>
                  <TouchableOpacity
                    style={styles.botonCantidad}
                    onPress={() => cambiarCantidad(p.id, -1)}
                  >
                    <Text style={styles.textoCantidad}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.cantidad}>
                    {p.cantidad}
                  </Text>

                  <TouchableOpacity
                    style={styles.botonCantidad}
                    onPress={() => cambiarCantidad(p.id, 1)}
                  >
                    <Text style={styles.textoCantidad}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <Text style={styles.total}>
            Total: Bs {total}
          </Text>

          <Boton
            texto="Confirmar pedido"
            accion={confirmarPedido}
          />

          <Boton
            texto="Seguir comprando"
            secundario
            accion={() => setPantalla('catalogo')}
          />
        </ScrollView>
      </View>
    );
  }

  if (pantalla === 'pedidos') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.lista}>
          <Text style={styles.titulo}>Mis pedidos</Text>

          {pedidos.length === 0 ? (
            <Text style={styles.subtitulo}>
              Todavía no tienes pedidos registrados.
            </Text>
          ) : (
            pedidos.map(pedido => (
              <View key={pedido.id} style={styles.tarjeta}>
                <Text style={styles.nombreProducto}>
                  Pedido #{pedido.id}
                </Text>

                <Text style={styles.detalle}>
                  Fecha: {pedido.fecha}
                </Text>

                {pedido.productos.map(p => (
                  <Text key={p.id} style={styles.detalle}>
                    {p.nombre} x {p.cantidad}
                  </Text>
                ))}

                <Text style={styles.precio}>
                  Total: Bs {pedido.total}
                </Text>

                <Text style={styles.estado}>
                  Estado: {pedido.estado}
                </Text>
              </View>
            ))
          )}

          <Boton
            texto="Volver al catálogo"
            accion={() => setPantalla('catalogo')}
          />
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    paddingTop: 45,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  formulario: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    paddingBottom: 45,
  },
  logo: {
    fontSize: 75,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#A83262',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
  },
  boton: {
    backgroundColor: '#C94F7C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 13,
    width: '100%',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C94F7C',
  },
  textoSecundario: {
    color: '#C94F7C',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8B6C8',
  },
  aviso: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 15,
  },
  lista: {
    padding: 20,
    paddingBottom: 45,
  },
  tarjeta: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
  },
  iconoProducto: {
    fontSize: 58,
    marginBottom: 10,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  precio: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C94F7C',
    marginVertical: 12,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  botonCantidad: {
    backgroundColor: '#C94F7C',
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCantidad: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  cantidad: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 25,
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A83262',
    textAlign: 'center',
    marginBottom: 22,
  },
  detalle: {
    fontSize: 15,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
  },
  estado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A83262',
    marginTop: 10,
  },
});
