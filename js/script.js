const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const botaoesAdicionar = document.querySelectorAll('.add-to-cart-btn')

let cart = []

// Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden')
    cartModal.classList.add('flex')

    updateCart()
})

// Fechar o modal quando clicar fora
cartModal.addEventListener('click', e => {
    if (e.target === cartModal) {
        cartModal.classList.remove('flex')
        cartModal.classList.add('hidden')
    }
})

// Fechar modal com o botão
closeModalBtn.addEventListener('click', () => {
    cartModal.classList.remove('flex')
    cartModal.classList.add('hidden')
})

menu.addEventListener('click', e => {
    let parentButton = e.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // Adicionar no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        // Se o item existe aumenta apenas a quantidade + 1
        existingItem.quantity++
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
    updateCart()
}

// Atualizar o carrinho
function updateCart() {
    cartItemsContainer.innerHTML = ''
    let total = 0
    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "items-center", "border-b", "border-gray-300", "py-2")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                </div>
                    <button class="cursor-pointer remove-btn" 
                    data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    cartCounter.textContent = cart.length
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
        const name = e.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index != -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCart()
            return
        }

        cart.splice(index, 1)
        updateCart()
    }
}

addressInput.addEventListener('input', e => {
    let inputValue = e.target.value

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressInput.classList.add('border-grey-200')
        addressWarn.classList.add('hidden')
    }
})

// finalizar pedido
checkoutBtn.addEventListener('click', () => {
    if(!isOpen) {
        Toastify({
            text: "Ops! O restaurante está fechado.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return
    }


    if (cart.length === 0) return

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.remove('border-grey-200')
        addressInput.classList.add('border-red-500')
        return
    }

    // Enviar pedido para api whats
    const cartItems = cart.map(item => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} \n`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = '11970798502'

    window.open(`https://wa.me/${phone}/?text=${message} Endereço: ${addressInput.value}`, `_blank`)

    cart = []
    updateCart()
})

// verificar e manipular o card horario
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22 // true = restaurante está aberto
}

const spamItem = document.getElementById('data-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spamItem.classList.remove('bg-red-500')
    spamItem.classList.add('bg-green-600')
} else {
    spamItem.classList.remove('bg-green-600')
    spamItem.classList.add('bg-red-500')
}