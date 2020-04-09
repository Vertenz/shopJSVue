Vue.component('grid-cart', {
    data() {
        return {
            cartItems: [],
            showCart: false,
            amount: 0,
            quantity_start: 0
        }
    },
    methods: {
        change_quantity(item) {
            this.$parent.getJson('/api/cart')
                .then(data => {
                    for(let el of data.contents){
                        console.log(el.id_product);
                        if (el.id_product === item.id_product) {
                            this.quantity_start = el.quantity;
                            this.$parent.putJson(`/api/cart/${item.id_product}`, {quantity: item.quantity-this.quantity_start})
                                .then(data => {
                                    if (data.result === 1) {
                                        this.amount = 0;
                                        this.cartItems.forEach((item) => {
                                            this.amount += item.price * item.quantity;
                                        });
                                    }
                                })
                        }
                    }
                });
        },
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id_product}`, {quantity: -1})
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                        }
                        this.amount = 0;
                        this.cartItems.forEach((item) => {
                            this.amount += item.price * item.quantity;
                        });
                    });                            // this.$parent.putJson(`/api/cart/${item.id_product}`, `${item.quantity - this.quantity_start}`)
                            //     .then(data => {
                            //         if (data.result === 1) {
                            //         }
                            //     })
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id_product}`)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                        this.amount = 0;
                        this.cartItems.forEach((item) => {
                            this.amount += item.price * item.quantity;
                        });
                    });
            }
        },
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for(let el of data.contents){
                    this.cartItems.push(el);
                }
                this.cartItems.forEach((item) => {
                    this.amount += item.price * item.quantity;
                });
            });
    },
    computed: {
    },
    template: `
<div>
    <div class="grid center">
            <div class="grid-name">
                <h3 class="grid__h">product details</h3>
            </div>
            <div class="grid-name center-flex">
                <h3 class="grid__h">unite price</h3>
            </div>
            <div class="grid-name center-flex">
                <h3 class="grid__h">quantity</h3>
            </div>
            <div class="grid-name center-flex">
                <h3 class="grid__h">shipping</h3>
            </div>
            <div class="grid-name center-flex">
                <h3 class="grid__h">subtotal</h3>
            </div>
            <div class="grid-name center-flex">
                <h3 class="grid__h">action</h3>
            </div>
    </div>
                    <p v-if="!cartItems.length" class="cart-text">Cart is empty</p>
                <cart-item
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                @remove="remove"
                :change_quantity="change_quantity"
                :quantity_start="quantity_start"
                >
                </cart-item>
                <section class="cart-button-section center">
    <div class="cart-button-box center">
        <a href="cart.html" class="cart-button">CLEAR SHOPPING CART</a>
        <a href="product-list.html" class="cart-button">CONTINUE SHOPPING</a>
    </div>
</section>
<section class="checkout-section center">
    <div class="shipping-box">
        <form action="#">
            <h3 class="shipping-box__h">Shipping Adress</h3>
            <input type="text" id="city" list="dl_city" placeholder="Bangladesh" class="checkout-section__input checkout-section__input_city">
            <datalist id="dl_city">
                <option value="Moscow"></option>
                <option value="New York"></option>
                <option value="Tokyo"></option>
            </datalist>
            <input type="text" class="checkout-section__input" placeholder="State">
            <input type="text" class="checkout-section__input" placeholder="Postcode / Zip">
            <input type="submit" value="get a quote" class="checkout-section__submit checkout-section__submit_quote">
        </form>
    </div>
    <div class="coupon-box">
        <form action="#">
            <h3 class="coupon-box__h">coupon discount</h3>
            <p class="coupon-box__p">Enter your coupon code if you have one</p>
            <input type="text" class="checkout-section__input" placeholder="Coupon cod">
            <input type="submit" value="Apply coupon" class="checkout-section__submit checkout-section__submit_coupon">
        </form>
    </div>
    <div class="checkout-box">
        <div class="checkoutText">
            <p class="checkout-box__p">sub total<span class="checkout-box__price">\&#36{{ amount }}</span></p>
            <h2 class="checkout-box__h">GRAND TOTAL<span class="checkout-box__grand mark">\&#36{{ amount }}</span></h2>
        </div>
        <a href="checkout.html" class="checkout-box__button">proceed to checkout</a>
    </div>
</section>
</div>
    `
});

Vue.component('cart-item', {
    props: ['cartItem', 'change_quantity'],
    template: `
        <div class="grid-carList center">
            <div class="grid-product">
                <a href="single.html" class="grid-product__link"><img src="images/cart/first.jpg" alt="product"
                                                            class="grid-product__img"></a>
                <div class="grid-product__description-box">
                    <a href="single.html" class="grid-product__link"><h2 class="grid-product__h">{{cartItem.product_name}}</h2></a>
                    <div class="grid-product__description-box_p">
                        <p class="grid-product__description">color: <span class="grid-product__color"> {{cartItem.color}}</span></p>
                        <p class="grid-product__description">size: <span class="grid-product__size">{{cartItem.size}}</span></p>
                    </div>
                </div>
            </div>
            <div class="grid-product center-flex">
                <p class="grid-product__price">\&#36{{cartItem.price}}</p>
            </div>
            <div class="grid-product center-flex">
                <form action="#" class="search-form" @submit.prevent="change_quantity(cartItem)">
                    <input type="input" class="grid-product__quantity" required min="1" max="99" v-model.number="cartItem.quantity">
                </form>
            </div>
            <div class="grid-product center-flex">
                <p class="grid-product__shipping">free</p>
            </div>
            <div class="grid-product center-flex">
                <p class="grid-product__subtotal">\&#36{{cartItem.price * cartItem.quantity}}</p>
            </div>
            <div class="grid-product center-flex">
                <button class="purchases__button" @click="$emit('remove', cartItem)"><i class="fas fa-times-circle"></i></button>
            </div>
    </div>
    `
});