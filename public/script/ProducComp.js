Vue.component('products', {
    data(){
        return {
            catalogUrl: '',
            products: [],
            filtered: [],
        }
    },
    methods: {
        filter(value){
            let regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted(){
        this.$parent.getJson('/api/products')
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
            });
    },
    template: `
        <section class="product-box center">
            <product ref="refref" v-for="item of filtered" :key="item.id_product" :product="item"></product>
        </section>
    `
});
Vue.component('product', {
    props: ['product'],
    data() {
      return {
          cartAPI: this.$root.$refs.cart,
      };
    },
    template: `
    <div class="product">
        <a href="single.html"><img class="product__img" src="images/productNew3.jpg" alt="T-Shirt"></a>
        <div class="product__text">
            <a href="single.html" class="product__name">{{product.product_name}}</a>
            <div class="product__price">\&#36{{product.price}}</div>
        </div>
        <button  class="product__add" @click="cartAPI.addProduct(product)"><i class="fas fa-cart-plus"></i>Add to Cart</button>
    </div>
    `
});
