<?php
const URL_MAIN = "http://localhost/GreedStore/";
const UPLOADS = "assets/uploads/";

require_once "app/config/config.php";
require_once "app/models/mdlProductos.php";
require_once "app/controllers/ctrProductos.php";
require_once "app/models/mdlCategorias.php";
require_once "app/controllers/ctrCategorias.php";
require_once "app/models/mdlUsuarios.php";
require_once "app/controllers/ctrUsuarios.php";
require_once "app/models/mdlPedidos.php";
require_once "app/controllers/ctrPedidos.php";
require 'assets/libs/PHPMailer/SMTP.php';
require 'assets/libs/PHPMailer/Exception.php';
require 'assets/libs/PHPMailer/PHPMailer.php';
require "assets/libs/FPDF/fpdf.php";

$ListCat = CtrCategorias::ctrListar('');
$error404 = 'templates/includes/404.php';
configuracion::configuracion_inicial();

if (isset($_GET['view'])) {

    $get = $_GET["view"];
    $url = rtrim($get, '/');
    $url = filter_var($url, FILTER_SANITIZE_URL);
    $url2 = explode('/', $url);
    $excluidos = array('login', 'admin','enviarboleta');

    if (!in_array($url2[0], $excluidos)) {
        include 'templates/includes/header.php';
    } else {
        $header = "templates/includes/header" . $url2[0] . ".php";
        if (file_exists($header)) {
            include $header;
        }
    }

    if (sizeof($url2) == 1) {
        $url2[0] = str_replace('-', ' ', $url2[0]);
        if (CtrCategorias::ctrListar($url2[0])) {
            $file = "templates/views/main.php";
            $cat = $url2[0];
        } else {
            $file = "templates/views/" . $url2[0] . ".php";
        }
        if (file_exists($file)) {

            include $file;
        } else {
            include $error404;
        }
    } else if (sizeof($url2) == 2) {
        if (is_numeric($url2[1])) {
            $file = "templates/views/" . $url2[0] . ".php";
            $idp = $url2[1];
        } else {
            $file = "templates/views/" . $url2[0] . "/" . $url2[1] . ".php";
        }
        if (file_exists($file)) {
            include $file;
        } else {
            include $error404;
        }
    } else if (sizeof($url2) == 3) {
        $file = "templates/views/" . $url2[0] . "/" . $url2[1] . "/" . $url2[2] . ".php";
        if (file_exists($file)) {
            include $file;
        } else {
            include $error404;
        }
    } else if (sizeof($url2) == 4) {
        $file = "templates/views/" . $url2[0] . "/" . $url2[1] . "/" . $url2[2] . "/" . $url2[3] . ".php";
        if (file_exists($file)) {
            include $file;
        } else {
            include $error404;
        }
    } else {
        include $error404;
    }
    if (!in_array($url2[0], $excluidos)) {
        include 'templates/includes/footer.php';
    }else{
        $footer = "templates/includes/footer" . $url2[0] . ".php";
        if(file_exists($footer)){
            include $footer;
            }
        }
} else if (isset($_GET['ruta'])) {
} else {
    include 'templates/includes/header.php';
    include 'templates/views/main.php';
    include 'templates/includes/footer.php';
}
?>