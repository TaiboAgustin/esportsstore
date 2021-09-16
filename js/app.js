//se crean constantes para acceder a cada elemento del html por su id
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content 
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

cards.addEventListener('click', e =>{ //registrar el evento de click sobre el boton de comprar para agregar el producto al carrito
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

    Object.values(carrito).forEach(producto => {

        //limpiar el carrito en cada iteracion para que no se sumen los productos mas de una vez
        items.innerHTML = ''

        //se comienza a levantar cada propiedad del producto comprado para reemplazar los valores del template con los valores del producto seleccionado
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clonar = templateCarrito.cloneNode(true)
        fragment.appendChild(clonar)
    })
    items.appendChild(fragment)
}