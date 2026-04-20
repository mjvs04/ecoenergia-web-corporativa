<?php
/* =============================================================
   php/procesar.php
   Backend PHP 8 para el formulario de contacto.
   Recibe POST, valida, sanitiza y envía email a la empresa.

   Requisitos del servidor:
     - PHP 8.x
     - Apache2 con mod_php
     - Función mail() configurada (o usar SMTP externo)
   ============================================================= */

/* ── 1. Solo aceptar POST ───────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

/* ── 2. Cabecera de respuesta JSON ──────────────────────── */
header('Content-Type: application/json; charset=UTF-8');

/*
 * Cabecera CORS — permite peticiones desde el mismo dominio.
 * En producción, sustituir '*' por el dominio exacto:
 *   header('Access-Control-Allow-Origin: https://ecoenergialocal.es');
 */
header('Access-Control-Allow-Origin: *');

/* ── 3. Recoger y sanitizar datos ───────────────────────── */
/*
 * htmlspecialchars() convierte caracteres peligrosos como
 * < > & " ' en entidades HTML, previniendo inyección XSS.
 * trim() elimina espacios al inicio y al final.
 * ?? '' — si el campo no existe en POST, devuelve cadena vacía.
 */
$nombre   = htmlspecialchars(trim($_POST['nombre']   ?? ''), ENT_QUOTES, 'UTF-8');
$email    = trim($_POST['email']   ?? '');
$telefono = htmlspecialchars(trim($_POST['telefono'] ?? ''), ENT_QUOTES, 'UTF-8');
$tipo     = htmlspecialchars(trim($_POST['tipo']     ?? ''), ENT_QUOTES, 'UTF-8');
$mensaje  = htmlspecialchars(trim($_POST['mensaje']  ?? ''), ENT_QUOTES, 'UTF-8');

/* ── 4. Validaciones ────────────────────────────────────── */

/* Campos obligatorios */
if (empty($nombre) || empty($email)) {
    http_response_code(422);
    echo json_encode([
        'ok'    => false,
        'error' => 'Nombre y email son obligatorios.'
    ]);
    exit;
}

/* Longitud máxima del nombre */
if (mb_strlen($nombre) > 120) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'El nombre es demasiado largo.']);
    exit;
}

/*
 * Validar formato del email con filtro nativo de PHP.
 * FILTER_VALIDATE_EMAIL comprueba la sintaxis RFC 822.
 */
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'ok'    => false,
        'error' => 'El formato del email no es válido.'
    ]);
    exit;
}

/* Sanitizar email (elimina caracteres no permitidos) */
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

/* Limitar longitud del mensaje para evitar abusos */
if (mb_strlen($mensaje) > 3000) {
    http_response_code(422);
    echo json_encode([
        'ok'    => false,
        'error' => 'El mensaje es demasiado largo (máx. 3000 caracteres).'
    ]);
    exit;
}

/* Protección contra header injection en el email */
if (preg_match('/[\r\n]/', $nombre . $email . $telefono)) {
    http_response_code(422);
    echo json_encode([
        'ok'    => false,
        'error' => 'Los datos contienen caracteres no permitidos.'
    ]);
    exit;
}

/* ── 5. Componer el email ───────────────────────────────── */

$destinatario = 'info@ecoenergialocal.es';

$asunto = mb_encode_mimeheader(
    'Nueva consulta web: ' . $nombre,
    'UTF-8', 'Q'
);

$cuerpo = <<<EOT
==============================================
 NUEVA SOLICITUD DESDE LA WEB
 EcoEnergía Local S.L.
==============================================

Nombre:    {$nombre}
Email:     {$email}
Teléfono:  {$telefono}
Tipo:      {$tipo}

Mensaje:
--------------
{$mensaje}
--------------

Fecha:     {$_SERVER['REQUEST_TIME_FLOAT']}
IP:        {$_SERVER['REMOTE_ADDR']}
User-Agent: {$_SERVER['HTTP_USER_AGENT']}

==============================================
EOT;

/* Formato de fecha legible */
$fecha = date('d/m/Y H:i:s');
$cuerpo = str_replace(
    $_SERVER['REQUEST_TIME_FLOAT'],
    $fecha,
    $cuerpo
);

/* Cabeceras del email */
$cabeceras  = "From: no-reply@ecoenergialocal.es\r\n";
$cabeceras .= "Reply-To: {$email}\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
$cabeceras .= "Content-Transfer-Encoding: 8bit\r\n";
$cabeceras .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";
$cabeceras .= "X-Priority: 3\r\n";

/* ── 6. Enviar el email ─────────────────────────────────── */
$enviado = mail($destinatario, $asunto, $cuerpo, $cabeceras);

/* ── 7. Guardar log de consultas (opcional) ─────────────── */
/*
 * Guarda un registro en un fichero de log en el servidor.
 * Descomenta si quieres mantener un historial de consultas.
 *
 * $logDir  = __DIR__ . '/../logs';
 * $logFile = $logDir . '/consultas.log';
 *
 * if (!is_dir($logDir)) mkdir($logDir, 0755, true);
 *
 * $linea = $fecha . ' | ' . $email . ' | ' . $nombre . "\n";
 * file_put_contents($logFile, $linea, FILE_APPEND | LOCK_EX);
 */

/* ── 8. Responder al frontend ───────────────────────────── */
if ($enviado) {
    echo json_encode([
        'ok'      => true,
        'mensaje' => 'Solicitud enviada correctamente. Te responderemos en menos de 24h.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Error al enviar el email. Por favor, inténtalo de nuevo.'
    ]);
}
?>
