//se crean constantes para acceder a cada elemento del html por su id
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content 
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    fetchData()

    if(localStorage.getItem('carrito')){//si esxiste ese elemento
        carrito = JSON.parse(localStorage.getItem('carrito'))
        dibujarCarrito()
    }
})

cards.addEventListener('click', e =>{ //registrar el evento de click sobre el boton de comprar para agregar el producto al carrito
    addCarrito(e)
})

items.addEventListener('click', e => {
    agregarOEliminarProductos(e)
})

const fetchData = async() => { //funcion de flecha encargada de hacer consumo del archivo json donde estan alojados los objetos de tipo camiseta
    try{
        const res = await fetch('api.json')//esperar la respuesta por parte del json
        const data =await res.json()//esperar la respuesta en json para guardar el array de objetos 
        //console.log(data)
        crearCards(data) 
    } catch(error){
        console.log(error)
    }
}

const crearCards = (data) => {//funcion encargada de crear  en el html cada card de cada objeto de tipo camiseta
    console.log(data) 
    data.forEach(producto =>{ //seleccionar cada etiqueta de la card para reemplazarlo por su respectivo valor correspondiente con el json de objetos
        templateCard.querySelector('h5').textContent = producto.title 
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clon = templateCard.cloneNode(true)
        fragment.appendChild(clon)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {//al momento de presionar el boton de comprar, se mandan todos los datos del objeto a la funcion setCarrito
    console.log(e.target)
    console.log(e.target.classList.contains('btn-dark'))//verificar si el elemento que se esta presionando es efectivamente el boton de comprar, arroja verdadero por consola en caso de serlo, y falso en caso contrario
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {//capturar el objeto junto con sus atributos 
    console.log(objeto)
    const jersey={
        id: objeto.querySelector('.btn-dark').dataset.id,//acceder al id del producto seleccionado
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(jersey.id)){//verificar si el producto se esta duplicando, es decir, si se quiere comprar el producto mas de una vez, para modificar la cantidad 
        jersey.cantidad = carrito[jersey.id].cantidad+1
    }
    carrito[jersey.id] = {...jersey}//hacer una copia del producto en caso de que se compre mas de uno
    
    console.log(jersey)
    dibujarCarrito()
}

const dibujarCarrito = () =>{ //funcion flecha encargada de generar el carrito de productos en el html, que contiene el producto a comprar, la cantidad de productos a comprar, el precio por cada producto y el precio total de la compra
    console.log(carrito)

    items.innerHTML = ''

    Object.values(carrito).forEach(jersey => {

        console.log(JSON.stringify(jersey))

        //limpiar el carrito en cada iteracion para que no se sumen los productos mas de una vez
        

        //se comienza a levantar cada propiedad del producto comprado para reemplazar los valores del template con los valores del producto seleccionado
        templateCarrito.querySelector('th').textContent = jersey.id
        templateCarrito.querySelectorAll('td')[0].textContent = jersey.title
        templateCarrito.querySelectorAll('td')[1].textContent = jersey.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = jersey.id
        templateCarrito.querySelector('.btn-danger').dataset.id = jersey.id
        templateCarrito.querySelector('span').textContent = jersey.cantidad * jersey.precio


        const clonar = templateCarrito.cloneNode(true)
        fragment.appendChild(clonar)
    })
    items.appendChild(fragment)

    dibujarFooterCarrito()

    localStorage.setItem('carrito', JSON.stringify(carrito))//almacenar un item en el localstorage cada vez que se agrega un producto al carrito, es decir, cada vez que se dibuje el producto a comprar en el carrito
}

const dibujarFooterCarrito = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){//verificar si en el carrito hay alguna camiseta para comprar, en caso de estarlo, se mantiene el th con el texto que ya estaba anteriormente
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        ` 
        return
    }

    const sumaCantidad = Object.values(carrito).reduce((contador, {cantidad})=> contador + cantidad, 0 ) //sumar la cantidad total de camisetas en el carrito
    const precioTotal = Object.values(carrito).reduce((contador,{cantidad, precio}) => contador + cantidad * precio, 0) //calcular el precio total de la compra
    console.log('la suma total de los productos en el carrito  es de: ' + sumaCantidad)
    console.log('el precio total de la compra es de: ' + precioTotal)

    templateFooter.querySelectorAll('td')[0].textContent = sumaCantidad
    templateFooter.querySelector('span').textContent = precioTotal

    const clon = templateFooter.cloneNode(true)

    fragment.appendChild(clon)

    footer.appendChild(fragment)

    const botonVaciarCarrito = document.getElementById('vaciar-carrito')
    botonVaciarCarrito.addEventListener('click', () => {
        carrito = {}
        dibujarCarrito()
    })
}

const agregarOEliminarProductos = e =>{//funcion encargada de darle funcionalidad a los botones de agregar una unidad y eliminar una unidad de ese producto en el carrito
    console.log(e.target)

    if(e.target.classList.contains('btn-info')){//verificar si se esta haciendo click al boton de agregar un producto
        console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ //sumarle 1 a la cantidad del producto que se desea comprar, siempre tomando al id del producto como identificador del mismo
        carrito[e.target.dataset.id] = {...producto} //hacer una copia del producto en caso de que se agregue uno mas
        dibujarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){//verificar si se esta haciendo click al boton de eliminar una unidad del producto  del carrito
        const producto = carrito[e.target.dataset.id]
        producto.cantidad -- //restarle 1 a la cantidad del producto que se desea comprar, siempre tomando al id del producto como identificador del mismo 
        if(producto.cantidad === 0){//en caso de que se eliminen todas las camisetas de un mismo tipo hasta llegar a 0, el producto se elimina del carrito
            delete carrito[e.target.dataset.id]
        }
        dibujarCarrito()
    }

    e.stopPropagation()
}


/* ---------------- Agrego boton  finalizar compra con jQuery --------------- */
$("body").append(
    '<button id="btn1" class="btn btn-success w-100 ">Finalizar compra</button>'
  );
  /* ------------------------ Asociamos el evento click ----------------------- */
  $("#btn1").click(function () {
    if (jQuery.isEmptyObject(carrito)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe seleccionar algun producto primero!",
      });
    } else Swal.fire("Gracias por confiar en nosotros", "Su pedido se realizo correctamente!", "success");
  
    carrito = {};
    pintarCarrito();
  });
  
  /* --------------------------- Animaciones Jquery --------------------------- */
  /* ------------ Agrego botón y un div con jQuery y oculto el div ------------ */
  $("body").prepend(
    '<button id="btn1" class="btn btn-warning w-100">Descuento Hot Sale 50% OFF</button>'
  );
  $("body").prepend(`<div id="div1" class="text-center" style="height: auto">
                          <h3 class="text-center">¡CODIGO DE DESCUENTO! 50% OFF</h3>
                          <h4>CODIGO: CAMADA18580</h4>
                      </div>`);
  $("#div1").hide();
  //Muestro el div usando toggle
  
  $("#btn1").click(() => {
    $("#div1").toggle("slow");
  });


/*scroll reveal*/

const sr = ScrollReveal({
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.img-fluid, .text-center, .word`,{origin: 'top', interval: 100})
