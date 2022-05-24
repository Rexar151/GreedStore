$(document).ready(function () {
    /* if(document.getElementById('btnagregar')) document.getElementById('btnagregar').disabled = true; */
    var urlLocation = 'http://localhost/GreedStore/'

    init_search_product();

    let select = document.getElementById('cbocategoria');

    let $detalles = document.querySelector("#detalles");

    let add_producto = document.querySelector("#add-producto");

    let update_producto = document.querySelector("#update-producto");

    let abrir_producto_modal = document.querySelector('#abrir_producto_modal');

    if (abrir_producto_modal) {
        abrir_producto_modal.addEventListener('click', () => {
            $("#form-producto")[0].reset();
            $(".modal-title").text("Agregar Producto")
            $('#exampleModal').modal('show')
            $("#update-producto").hide();
            $("#add-producto").show();
            cargarDetalles(0);
        })
    }
    if (select) {
        select.addEventListener('change', function () {
            let selectedOption = Number(this.options[select.selectedIndex].value);
            cargarDetalles(selectedOption);
        });
    }

    if (add_producto) {
        add_producto.addEventListener('click', function (e) {
            e.preventDefault();
            let campos = document.querySelectorAll("#form-producto input[type=text].detalle-producto");
            let cadena = "";
            campos.forEach(function (campo) {
                cadena += campo.value + "/";
            })
            let detallesProductos = cadena.substring(0, cadena.length - 1);

            if ($("#form-producto #nombre").val().trim().length == 0 || $("#form-producto #stock").val().trim().length == 0 || $("#form-producto #precio").val().trim().length == 0 || $("#form-producto #foto")[0].files.length == 0 || select.selectedIndex == 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Complete los campos',
                    showConfirmButton: false,
                    timer: 2500
                })
            } else {
                const data = new FormData($("#form-producto").get(0));
                data.append('detalles', detallesProductos);
                $.ajax({
                    type: "POST",
                    url: urlLocation + "?ruta=Productos/AgregarProducto",
                    dataType: "JSON",
                    contentType: false,
                    cache: false,
                    processData: false,
                    data: data,
                    beforeSend: function () {
                        $("#form-producto").waitMe();
                    }
                }).done(function (res) {
                    if (res.status == "201") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: res.msg,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else if (res.status == "400") {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: res.msg,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    $("#form-producto")[0].reset();
                    $('#exampleModal').modal('hide');
                }).fail(function (err) {

                }).always(function () {
                    $("#form-producto").waitMe('hide');
                    init_search_product();
                });
            }

        })
    }
    if (update_producto) {
        update_producto.addEventListener('click', function (e) {
            e.preventDefault();
            let campos = document.querySelectorAll("#form-producto input[type=text].detalle-producto");
            let cadena = "";
            campos.forEach(function (campo) {
                cadena += campo.value + "/";
            })
            let detallesProductos = cadena.substring(0, cadena.length - 1);

            if ($("#form-producto #nombre").val().trim().length == 0 || $("#form-producto #idproducto").val().trim().length == 0 || $("#form-producto #stock").val().trim().length == 0 || $("#form-producto #precio").val().trim().length == 0 || select.selectedIndex == 0 || $("#form-producto #foto_anterior").val().trim().length == 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Complete los campos',
                    showConfirmButton: false,
                    timer: 2500
                })
            } else {
                const data = new FormData($("#form-producto").get(0));
                data.append('detalles', detallesProductos);
                $.ajax({
                    type: "POST",
                    url: urlLocation + "?ruta=Productos/EditarProducto",
                    dataType: "JSON",
                    contentType: false,
                    cache: false,
                    processData: false,
                    data: data,
                    beforeSend: function () {
                        $("#form-producto").waitMe();
                    }
                }).done(function (res) {
                    if (res.status == "200") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: res.msg,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else if (res.status == "400") {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: res.msg,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    $("#form-producto")[0].reset();
                    $('#exampleModal').modal('hide');
                }).fail(function (err) {

                }).always(function () {
                    $("#form-producto").waitMe('hide');
                    init_search_product();
                });
            }
        })
    }
});

let $detalles = document.querySelector("#detalles");


async function init_search_product() {

    await buscar_productos();

    let btn_view_producto = document.querySelectorAll('.btn-view-producto');
    let btn_delete_producto = document.querySelectorAll('.btn-delete-producto');

    btn_view_producto.forEach(function (btn) {

        btn.addEventListener('click', function (e) {

            e.preventDefault();
            $(".modal-title").text("Editar Categoria");

            let producto = Number(e.target.dataset.idpro);

            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: urlLocation + "?ruta=Productos/ListarItemAJAX",
                data: { producto },
                beforeSend: function () {
                    $("#form-producto").waitMe();

                }
            }).done(function (res) {
                (async function () {
                    await cargarDetalles(res.categoria);

                    document.querySelectorAll("#cbocategoria option")[Number(res.categoria)].selected = true

                    $("#form-producto #nombre").val(res.nombre);

                    $("#form-producto #idproducto").val(res.idproducto);

                    $("#form-producto #foto_anterior").val(res.foto_producto);

                    $("#form-producto #stock").val(res.stock);

                    $("#form-producto #precio").val(res.precio);

                    let detalles = res.descripcion.split('/');

                    let campos = document.querySelectorAll("#form-producto input[type=text].detalle-producto");

                    campos.forEach(function (campo, index) {
                        campo.value = detalles[index];
                    });

                    $("#form-producto").waitMe('hide');

                    $('#exampleModal').modal('show')

                    $("#update-producto").show();

                    $("#add-producto").hide();

                })();
            }).fail(function (err) {
            }).always(function () {
            });

        });
    });
    btn_delete_producto.forEach(function (btn) {

        btn.addEventListener('click', function (e) {

            e.preventDefault();

            let producto = Number(e.target.dataset.idpro);
            console.log(producto);

            if (producto != null) {
                Swal.fire({
                    title: 'Estas seguro?',
                    text: "No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, bórralo!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: "POST",
                            url: urlLocation + "?ruta=Productos/EliminarProducto",
                            data: { idproducto: producto },
                        }).done(function (res) {
                            if (res.status == "200") {
                                Swal.fire(
                                    'Eliminado!',
                                    res.msg,
                                    'success'
                                )
                            } else if (res.status == "400") {
                                Swal.fire(
                                    'Error!',
                                    res.msg,
                                    'error'
                                )
                            }

                        }).fail(function (err) {

                        }).always(function () {
                            init_search_product();
                        });
                    }
                })
            }

        });

    });

}


async function cargarDetalles(option) {
    if (option !== 0) {
        await $.ajax({
            type: "POST",
            url: urlLocation + "?ruta=Categorias/ListarCategoriaTabla",
            data: { idcategoria: option },
            dataType: "html",
            success: function (response) {
                $("#detalles").html(response);
            }
        });
    } else {
        $detalles.innerHTML = "";
    }
}

$("#filtroProd").change(function (e) {
    buscar_productos();
    //alert ($("#filtroProd option:selected").text());
});
$("#busquedaProd").keyup(function (e) {
    buscar_productos();
    //alert($("#busquedaProd").val());
});

async function buscar_productos() {
    nom = $("#busquedaProd").val();
    ord = $("#filtroProd option:selected").text();
    await $.ajax({
        type: "POST",
        url: urlLocation + "?ruta=Productos/ListarPor",
        data: { nombre: nom, orden: ord },
        dataType: "html",
        success: function (response) {
            $("#tabla-productos").html(response);
        }
    });

}
