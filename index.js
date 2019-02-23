const express = require('express');
const cors = require('cors');
var mysql = require('mysql');

const app = express();

app.use(cors());
const SELECT_CATALOGO_ARTICULOS =
  ' SELECT username, password FROM trackingTrucks.usuarios WHERE idEstatus = 1;';
const SELECT_CATALOGO_CLIENTES = 'SELECT * from clientes';
const SELECT_CATALOGO_VENTAS =
  "SELECT	v.folio, v.id_cliente , concat(c.nombre,  ' '  ,c.apellido_paterno, ' '  ,c.apellido_materno) as nombre , v.total, v.fecha FROM	ventas v	INNER JOIN clientes c ON v.id_cliente = c.id_cliente";
const SELECT_CONFIGURACION = 'SELECT tasa, enganche, plazo FROM configuracion';

function handleDisconnect() {
  connection = mysql.createConnection({
    host: '167.99.236.234',
    user: 'diego',
    password: 'D13g0.GMR_!',
    database: 'trackingTrucks'
  });

  connection.connect(function(err) {
    if (err) {
      console.log('Error al conectar:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

console.log(connection);
app.get('/clientes/nuevoCliente', (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, rfc } = req.query;
  const INSERTAR_CLIENTE = `INSERT INTO clientes(id_cliente, nombre,  apellido_paterno, apellido_materno, RFC) VALUES 	(null,'${nombre}','${apellido_paterno}','${apellido_materno}','${rfc}')`;
  connection.query(INSERTAR_CLIENTE, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/ventas/nuevaVenta', (req, res) => {
  const { id_cliente, plazos, total } = req.query;
  const INSERTAR_VENTA = `INSERT INTO ventas(folio, id_cliente, plazos, total, fecha) VALUES 	(null,'${id_cliente}','${plazos}','${total}',NOW())`;
  connection.query(INSERTAR_VENTA, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});
app.get('/ventas/nuevaVenta_Articulo', (req, res) => {
  const { id_venta, id_articulo, cantidad } = req.query;
  const INSERTAR_VENTA_ARTICULOS = `INSERT INTO ventas_articulos(id_venta_articulo, id_venta, id_articulo, cantidad) VALUES (null,'${id_venta}','${id_articulo}','${cantidad}')`;
  connection.query(INSERTAR_VENTA_ARTICULOS, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/ventas/actualizarArticulo', (req, res) => {
  const { cantidad, id_articulo } = req.query;
  const ACTUALIZAR_ARTICULO_1 = `UPDATE articulos  SET existencia = existencia - '${cantidad}' WHERE id_articulo = '${id_articulo}'`;
  connection.query(ACTUALIZAR_ARTICULO_1, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/articulos/nuevoArticulo', (req, res) => {
  const { descripcion, modelo, precio, existencia } = req.query;
  const INSERTAR_ARTICULO = `INSERT INTO articulos  ( id_articulo ,  descripcion ,  modelo ,  precio ,  existencia ) VALUES (null, '${descripcion}','${modelo}', '${precio}','${existencia}')`;
  connection.query(INSERTAR_ARTICULO, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/configuracion/actualizarConfiguracion', (req, res) => {
  const { tasa, enganche, plazo } = req.query;
  const ACTUALIZAR_CONFIGURACION = `UPDATE configuracion  SET tasa ='${tasa}', enganche = '${enganche}', plazo = '${plazo}' WHERE id_configuracion = 1`;
  connection.query(ACTUALIZAR_CONFIGURACION, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.put('/clientes/actualizarCliente', (req, res) => {
  const ACTUALIZAR_CLIENTE = `UPDATE trailer  SET  nombre = "guachumilito" WHERE id = 3`;
  connection.query(ACTUALIZAR_CLIENTE, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/articulos/actualizarArticulo', (req, res) => {
  const { descripcion, modelo, precio, existencia, id_articulo } = req.query;
  const ACTUALIZAR_ARTICULO = `UPDATE articulos  SET descripcion = '${descripcion}', modelo = '${modelo}',precio =  ${precio},existencia = ${existencia} WHERE id_articulo = '${id_articulo}'`;
  connection.query(ACTUALIZAR_ARTICULO, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send('SE AGREGO');
    }
  });
});

app.get('/articulos/catalogoArticulos', (req, res) => {
  connection.query(SELECT_CATALOGO_ARTICULOS, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/catalogoClientes', (req, res) => {
  connection.query(SELECT_CATALOGO_CLIENTES, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});
app.get('/catalogoVentas', (req, res) => {
  connection.query(SELECT_CATALOGO_VENTAS, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get('/configuracion', (req, res) => {
  connection.query(SELECT_CONFIGURACION, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.listen(4003, () => {
  console.log('SERVIDOR EN EL PUERTO 4003');
});
