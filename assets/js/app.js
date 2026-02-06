let cart = JSON.parse(localStorage.getItem("cart")) || [];

const modalEmpty = document.getElementById("modalEmpty");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const modalItems = document.getElementById("modalItems");
const modalTotal = document.getElementById("modalTotal");
const modalFooter = document.getElementById("modalFooter");

/* Currency formatter */

const money = n =>
    new Intl.NumberFormat("es-MX",{
        style:"currency",
        currency:"USD"
    }).format(n);

/* Save cart to localStorage */

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* Add products to cart */

document.querySelectorAll(".add-to-cart").forEach(btn=>{

    btn.addEventListener("click", ()=>{

        const originalText = btn.innerText;
        btn.innerText = "Agregando...";
        btn.disabled = true;

        setTimeout(()=>{

            const product = {
                name: btn.dataset.name,
                price: Number(btn.dataset.price),
                img: btn.dataset.img,
                qty:1
            };

            const existing = cart.find(p => p.name === product.name);

            if(existing){
                existing.qty++;
            }else{
                cart.push(product);
            }

            saveCart();
            updateCart();

            btn.innerText = originalText;
            btn.disabled = false;

            showToast("Producto agregado","success");

        },300);
    });

});

/* Update cart UI */

function updateCart(){

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item,index)=>{

        const subtotal = item.price * item.qty;

        total += subtotal;
        count += item.qty;

        cartItems.innerHTML += `
        <tr>
            <td>${item.name}</td>

            <td>
                <input 
                    type="number"
                    min="1"
                    value="${item.qty}"
                    id="qty-${index}"
                    class="form-control"
                >
            </td>

            <td>${money(item.price)}</td>
            <td><strong>${money(subtotal)}</strong></td>

            <td style="display:flex; gap:6px;">
                <button 
                    class="btn btn-success btn-sm"
                    onclick="saveQty(${index})">
                    Guardar
                </button>

                <button 
                    class="btn btn-danger btn-sm"
                    onclick="removeItem(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
        `;
    });

    cartTotal.textContent = money(total);
    modalTotal.textContent = money(total);
    cartCount.textContent = count;

    saveCart();
}

/* Save quantity after manual confirmation */

function saveQty(index){

    const input = document.getElementById(`qty-${index}`);
    const qty = Number(input.value);

    if(qty <= 0){
        removeItem(index);
        return;
    }

    cart[index].qty = qty;

    updateCart();

    showToast("Cantidad actualizada","success");
}

/* Remove product from cart */

function removeItem(index){

    cart.splice(index,1);

    updateCart();

    showToast("Producto eliminado","warning");
}

/* Render modal content */

document
.getElementById("cartModal")
.addEventListener("show.bs.modal", renderModal);

function renderModal(){

    modalItems.innerHTML = "";

    let total = 0;

    if(cart.length === 0){

        modalEmpty.style.display = "block";
        modalItems.style.display = "none";
        modalFooter.style.display = "none";

        return;
    }

    modalEmpty.style.display = "none";
    modalItems.style.display = "block";
    modalFooter.style.display = "block";

    cart.forEach(item=>{

        const subtotal = item.price * item.qty;
        total += subtotal;

        modalItems.innerHTML += `
        <div style="
            display:flex;
            gap:16px;
            align-items:center;
            margin-bottom:16px;
            border-bottom:1px solid #eee;
            padding-bottom:12px;
        ">

            <img 
                src="${item.img}" 
                width="90"
                style="border-radius:10px;"
            >

            <div style="flex:1;">
                <strong style="font-size:16px;">
                    ${item.name}
                </strong>

                <p style="margin:4px 0;">
                    ${item.qty} x ${money(item.price)}
                </p>

                <strong>
                    Subtotal: ${money(subtotal)}
                </strong>
            </div>
        </div>
        `;
    });

    modalTotal.textContent = money(total);
}

/* Toast notification */

function showToast(msg,type){

 const toast = document.getElementById("toast");

 toast.style.display="block";
 toast.textContent=msg;

 toast.style.background =
 type==="success" ? "#16a34a" : "#ea580c";

 setTimeout(()=>{
    toast.style.display="none";
 },2000);
}

/* Initialize cart */

updateCart();