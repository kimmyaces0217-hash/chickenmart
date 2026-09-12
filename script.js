const WHATSAPP_NUMBER="254758144655"; // Change to owner's WhatsApp number.
const MSG={general:"Hello Chicken Mart! I would like to place an order. Please assist me.",delivery:"Hello Chicken Mart! I would like delivery. My location is: ",contact:"Hello Chicken Mart! I have an enquiry.",chat:"Hello Chicken Mart! I would like to chat with you."};
const openWA=m=>window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(m),"_blank");
let cart = JSON.parse(localStorage.getItem("favorCart") || "[]");


/* =========================================================
   TOAST
========================================================= */

const toast = t => {

    let x = document.querySelector(".toast");

    if (!x) {
        x = document.createElement("div");
        x.className = "toast";
        document.body.appendChild(x);
    }

    x.textContent = t;
    x.classList.add("show");

    setTimeout(() => {
        x.classList.remove("show");
    }, 2200);
};


/* =========================================================
   SAVE CART
========================================================= */

function save() {

    localStorage.setItem(
        "favorCart",
        JSON.stringify(cart)
    );

    updateCartUI();
}


/* =========================================================
   CART TOTAL
========================================================= */

function cartTotal() {

    return cart.reduce(
        (total, item) => total + (item.price * item.qty),
        0
    );
}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartUI() {

    const count = cart.reduce(
        (total, item) => total + item.qty,
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach(el => el.textContent = count);

    renderCart();
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const itemsContainer =
        document.querySelector("#cartItems");

    const empty =
        document.querySelector("#cartEmpty");

    const footer =
        document.querySelector("#cartFooter");

    const total =
        document.querySelector("#cartTotal");

    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";

    if (!cart.length) {

        empty.style.display = "block";
        footer.style.display = "none";
        return;
    }

    empty.style.display = "none";
    footer.style.display = "block";


    cart.forEach((item, index) => {

        const subtotal = item.price * item.qty;

        const row = document.createElement("div");

        row.className = "cart-item";

        row.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <div class="cart-item-price">
                    KES ${item.price.toLocaleString()} / kg
                </div>

                <div class="cart-item-subtotal">
                    KES ${subtotal.toLocaleString()}
                </div>

            </div>


            <div>

                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="cart-qty-btn"
                        data-cart-minus="${index}">
                        −
                    </button>

                    <span class="cart-qty">
                        ${item.qty} kg
                    </span>

                    <button
                        type="button"
                        class="cart-qty-btn"
                        data-cart-plus="${index}">
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="cart-remove"
                    data-cart-remove="${index}">
                    Remove
                </button>

            </div>
        `;

        itemsContainer.appendChild(row);
    });


    if (total) {

        total.textContent =
            "KES " + cartTotal().toLocaleString();
    }
}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    const modal =
        document.querySelector("#cartModal");

    if (!modal) return;

    renderCart();

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    const modal =
        document.querySelector("#cartModal");

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================================
   SEND CART TO WHATSAPP
========================================================= */

function sendCart() {

    if (!cart.length) {

        toast("Your order is empty");

        return;
    }


    const items = cart
        .map(item =>
            "• " +
            item.name +
            " — " +
            item.qty +
            " kg × KES " +
            item.price.toLocaleString() +
            " = KES " +
            (item.price * item.qty).toLocaleString()
        )
        .join("\n");


    const total =
        cartTotal().toLocaleString();


    const message =
        "Hello Favor Farm Fresh Chicken!\n\n" +

        "I would like to order:\n" +

        items +

        "\n\nEstimated total: KES " +

        total +

        "\n\nPlease confirm availability, " +
        "delivery charge and final total.";


    openWA(message);
}


/* =========================================================
   CLICK HANDLER
========================================================= */

document.addEventListener("click", e => {


    /* ADD PRODUCT */

    const add =
        e.target.closest("[data-add]");

    if (add) {

        const product =
            add.closest(".product");

        const qtyInput =
            product.querySelector(".qty");

        const qty =
            Math.max(
                1,
                parseInt(qtyInput.value) || 1
            );

        const name =
            product.dataset.name;

        const price =
            Number(product.dataset.price);


        const existing =
            cart.find(
                item => item.name === name
            );


        if (existing) {

            existing.qty += qty;

        } else {

            cart.push({
                name: name,
                price: price,
                qty: qty
            });
        }


        save();

        toast(
            name +
            " added to your order"
        );

        return;
    }


    /* QUICK WHATSAPP PRODUCT ORDER */

    const quick =
        e.target.closest("[data-product-wa]");

    if (quick) {

        openWA(
            "Hello Favor Farm Fresh Chicken! " +
            "I would like to order " +
            quick.dataset.productWa +
            ". Please confirm price and availability."
        );

        return;
    }


    /* GENERAL WHATSAPP BUTTONS */

    const wa =
        e.target.closest("[data-wa]");

    if (wa) {

        e.preventDefault();

        openWA(
            MSG[wa.dataset.wa] ||
            MSG.general
        );

        return;
    }


    /* OPEN CART */

    if (e.target.closest("[data-cart-open]")) {

        openCart();

        return;
    }


    /* CLOSE CART */

    if (e.target.closest("[data-cart-close]")) {

        closeCart();

        return;
    }


    /* PLUS */

    const plus =
        e.target.closest("[data-cart-plus]");

    if (plus) {

        const index =
            Number(plus.dataset.cartPlus);

        cart[index].qty++;

        save();

        return;
    }


    /* MINUS */

    const minus =
        e.target.closest("[data-cart-minus]");

    if (minus) {

        const index =
            Number(minus.dataset.cartMinus);

        cart[index].qty--;


        if (cart[index].qty <= 0) {

            cart.splice(index, 1);
        }


        save();

        return;
    }


    /* REMOVE */

    const remove =
        e.target.closest("[data-cart-remove]");

    if (remove) {

        const index =
            Number(remove.dataset.cartRemove);

        const removed =
            cart[index].name;

        cart.splice(index, 1);

        save();

        toast(
            removed +
            " removed from your order"
        );

        return;
    }


    /* SEND CART */

    if (e.target.closest("[data-cart-send]")) {

        sendCart();

        return;
    }

});


/* =========================================================
   CLOSE CART WITH ESCAPE
========================================================= */

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeCart();
    }
});


/* =========================================================
   INITIAL CART LOAD
========================================================= */

updateCartUI();
/* =========================================================
   DIRECTOR MORE / LESS
========================================================= */

document.addEventListener("click", function(e) {

    const director = e.target.closest(".director");
    const moreButton = e.target.closest(".director-more");

    /* If More/Less was clicked */
    if (moreButton && director) {

        const isExpanded = director.classList.contains("expanded");

        /* Close all directors first */
        document.querySelectorAll(".director.expanded").forEach(item => {
            item.classList.remove("expanded");

            const btn = item.querySelector(".director-more");
            if (btn) btn.textContent = "More";
        });

        /* Open the selected director */
        if (!isExpanded) {
            director.classList.add("expanded");
            moreButton.textContent = "Less";
        }

        return;
    }

    /* Clicking anywhere outside a director closes them */
    if (!director) {

        document.querySelectorAll(".director.expanded").forEach(item => {
            item.classList.remove("expanded");

            const btn = item.querySelector(".director-more");
            if (btn) btn.textContent = "More";
        });

    }

});
/* =========================================================
   MOBILE MENU
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", function (e) {

        e.preventDefault();

        nav.classList.toggle("open");

        menuToggle.classList.toggle("active");

    });


    /* Close menu when a link is clicked */

    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("open");
            menuToggle.classList.remove("active");

        });

    });

});
