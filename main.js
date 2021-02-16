/*
 *
 *	Funcioon Guardar un archivo al bucket proyecto-backend
 *
 */

// Credenciales del bucket 
var bucketName=""
var bucketRegion="" 
var IdentityPoolId = ""
// Iniciando configuración de la clase AWS
AWS.config.update({
	// Region del bucket
  	region: bucketRegion,
  	// Se obtiene la credenciales de la cuenta a traves del IdentityPoolId
  	credentials: new AWS.CognitoIdentityCredentials({
    	IdentityPoolId: IdentityPoolId
  	})
});
// Creando conexion a instancia del bucket
var s3 = new AWS.S3({
	apiVersion: "2006-03-01",
    params: {Bucket: bucketName}
});

// Funcion para subir archivo
function addFile(){	
	event.preventDefault()
	// boton cancelar descarga
	var button_cancel = document.getElementById("cancel")
	// archivo que se selecciono
	var files = document.getElementById('file').files
	// Si el archivo no existe
	if(!files.length){
		// Emite una alerta
		return alert("Elige un archivo valido")
	}
	// Guardamos el archivo
	var file = files[0];
	// Obtenemos el nombre
	var file_name = file.name
	// Creamos ruta de la carpeta en aws
	var file_storage_key=encodeURIComponent("Prueba") + "/"
	// Creamos la ruta final del archivo
	var file_key= file_storage_key+file_name
	// Usando S3 ManagedUpload class que soporta multipart uploads
	var upload = new AWS.S3.ManagedUpload({
		// Tamaño de las partes
		partSize: 5 * 1024 * 1024, // 5 MB
		// Parametos del archivo a enviar
		params : {
			// bucket donde se envia
			Bucket: bucketName,
			// Ruta donde se almacena
			Key: file_key,
			// Cuerpo del archivo
			Body: file
		}
	})
	// lanzando la promesa y verificar progreso de la carga
	var promise = upload.on('httpUploadProgress', function(evt) {
		// Info del porcentaje de la carga (ingrese su progress bar frontend)
		console.log(evt)
      	console.log("Cargando :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
      	// Habilitamos vista del boton cancelar descarga
      	button_cancel.style.display = "block"
      	// lanza promesa
    }).promise();

	// Funcion para cancelar descarga 
	// cuando se lanza el evento click en boton cancelar
    button_cancel.onclick = function(){
    	// Alerta de cancelar
    	alert("cancelar")
    	// Se aborta el upload de aws
    	upload.abort()
    	// Se esconde el boton cancel
    	button_cancel.style.display = "none"
    }

    // Resolucion de la promeeesa
	promise.then((data)=>{
		// Info de Aws del archivo cargado
		console.log("data",data)
		// Se oculta el boton cancelar
		button_cancel.style.display = "none"
	},(error)=>{
		// Info del error del archivo
		console.log("error",error)
	})
}