Vue.component('cart', {
    data() {
        return {
            //TODO counter актуальный
            // cartUrl: '/cart',
            cartItems: [],
            amount: 0
        }
    },
    methods: {
        // addProduct(product) {
        //     let find = this.cartItems.find(el => el.id_product === product.id_product);
        //     if (find) {
        //         this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1});
        //         find.quantity++;
        //         this.amount = 0;
        //         this.cartItems.forEach((item) => {
        //             this.amount += item.price * item.quantity;
        //         });
        //     } else {
        //         let prod = Object.assign({quantity: 1}, product);
        //         this.$parent.postJson('/api/cart', prod)
        //             .then(data => {
        //                 if (data.result === 1) {
        //                     this.cartItems.push(prod);
        //                 }
        //                 this.amount = 0;
        //                 this.cartItems.forEach((item) => {
        //                     this.amount += item.price * item.quantity;
        //                 });
        //             });
        //     }
        // },
        addProduct(product) {
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1});
                find.quantity++;
                this.amount = 0;
                this.cartItems.forEach((item) => {
                    this.amount += item.price * item.quantity;
                });
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson('/api/cart', prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod);
                        }
                        this.amount = 0;
                        this.cartItems.forEach((item) => {
                            this.amount += item.price * item.quantity;
                        });
                    });
            }
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
                    });
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
    template: `
        <div>
            <div class="cart-block">
                <p v-if="!cartItems.length" class="cart-text">Cart is empty</p>
                <purchases class="cart-item" 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                @remove="remove">
                </purchases>
                <div class="purchases__total-box">
                   <p class="total__text">total:</p>
                   <p class="total__price mark">\&#36{{amount}}</p>
                </div>
            </div>
        </div>`
});
Vue.component('purchases', {
    props: ['cartItem'],
    template: `                            <div class="purchases">                            
                                            <div class="purchases__img-box">
                                                <a href="single.html"><img src="images/purchases1.jpg" alt="#" class="purchases__img"></a>
                                            </div>
                                            <div class="purchases__description-box">
                                                <h4 class="purchases__h"><a href="product-list.html">{{cartItem.product_name}}</a></h4>
                                                <div class="purchases__star-box">
                                                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i><i class="fas fa-star"></i>
                                                </div>
                                                <div class="purchases__quantity-box">
                                                    <p class="quantity">{{cartItem.quantity}} X </p>
                                                    <p class="quantity__prise"> \&#36{{cartItem.price}}</p>
                                                </div>
                                            </div>
                                            <div class="purchases__cross-box">
                                                <button @click="$emit('remove', cartItem)" class="purchases__button"><i class="far fa-times-circle purchases__cross"></i></button>
                                            </div>
                    </div>
</div>
    `
});
