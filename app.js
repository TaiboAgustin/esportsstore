const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content //acceder a cada elemento
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

items.addEventListener('click', e =>{ //registrar el evento de click sobre el boton de comprar para agregar el producto al carrito
    addCarrito(e)
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
    items.appendChild(fragment)
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

    if(carrito.hasOwnProperty(producto.id)){//verificar si el producto se esta duplicando, es decir, si se quiere comprar el producto mas de una vez, para modificar la cantidad 
        producto.cantidad = carrito[producto.id].cantidad+1
    }
    carrito[producto.id] = {...producto}//hacer una copia del producto en caso de que se compre mas de uno
    
    console.log(jersey)
}