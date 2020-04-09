Vue.component('filter-el', {
    data(){
        return {
            userSearch: '',
            visibile: this.$parent.visible,
        }
    },
    template: `
            <form action="#" class="search-form" @submit.prevent="$parent.$refs.products.filter(userSearch)">
                <input type="text" class="header__search" placeholder="Search for Item..." v-model="userSearch">
                <button class="btn-search header__searchButton" type="submit" @click="visibile">
                    <i class="fas fa-search"></i>
                </button>
            </form>
    `
});
