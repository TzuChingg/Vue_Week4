import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

let productModal = null;
let delProductModal = null;

const app = createApp({
    data() {
        return {
            api_Url: 'https://ec-course-api.hexschool.io/v2',
            api_Path: 'chinging',
            products: [], 
            modalProduct: {
                imagesUrl:[]
            },
            newModalProduct: {},
            state: '',
            totalPages: 0,
            page: 1
        }
    },
    methods: {
        checkUser(){
            axios.post(`${this.api_Url}/api/user/check`)
                .then((res) => {
                    console.log("使用者驗證正確");
                    this.getProducts()
                }).catch((err) => {
                    alert(err.response.data.message);
                    window.location = 'index.html'
                });
        },
        getProducts(){
            axios.get(`${this.api_Url}/api/${this.api_Path}/admin/products?page=${this.page}`)
                .then((res) => {
                    this.products = res.data.products
                    this.totalPages = res.data.pagination.total_pages
                    console.log('getProducts');
                }).catch((err) => {
                    alert(err.response.data.message);
                });
        },
        openModal(state, item){
            if (state === 'isNew'){
                this.state = state
                this.modalProduct = {}
                productModal.show()
            }else if (state === 'edit'){
                this.state = state
                this.modalProduct = JSON.parse(JSON.stringify(item))
                productModal.show()
            }else if (state === 'del'){
                this.modalProduct = item
                delProductModal.show()
            }
        },
        changePage(page){
            this.page = page;
            this.getProducts();
        }
    },
    mounted() {
        axios.defaults.headers.common['Authorization'] = document.cookie.split('=')[1]
        this.checkUser()
    },
})


app.component('productModal',{
    props:['tempProduct', 'state'],
    template: '#productModal',
    data() {
        return {
            api_Url: 'https://ec-course-api.hexschool.io/v2',
            api_Path: 'chinging',
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('editProduct'),{
            keyboard: false,
            // backdrop: 'static'
        })
    },
    methods: {
        // openModal() {
        //     productModal.show();
        //   },
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        updateProduct(){
            let url = `${this.api_Url}/api/${this.api_Path}/admin/product`;
            let way = 'post';
            if (this.state !== 'isNew') {
              url = `${this.api_Url}/api/${this.api_Path}/admin/product/${this.tempProduct.id}`;
              way = 'put'
            }
      
            axios[way](url, { data: this.tempProduct }).then((response) => {
              alert(response.data.message);
              productModal.hide();
              this.$emit('updateProduct')
            }).catch((err) => {
              alert(err.response.data.message);
            })
            console.log('產品更新');
        },
    },
});

app.component('delProductModal', {
    props:['tempProduct'],
    template:'#delProductModal',
    data() {
        return {
            api_Url: 'https://ec-course-api.hexschool.io/v2',
            api_Path: 'chinging',
        }
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProduct'))
    },
    methods: {
        delProduct(){
            axios.delete(`${this.api_Url}/api/${this.api_Path}/admin/product/${this.tempProduct.id}`)
            .then((result) => {
                alert(result.data.message)
                delProductModal.hide()
                this.$emit('updateProduct')
            }).catch((err) => {
                alert(err.response.data.message);
            });
        }
    },
})

app.component('pagination', {
    props: ['pages'],
    template: '#pagination',
    data() {
        return {
            tempPage: 1
        }
    },
    methods: {
        changePage(page){
            this.tempPage = page
            this.$emit('changePage', page)
        }
    },
})

app.mount('#app')