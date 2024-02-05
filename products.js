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
            state: ''
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
            axios.get(`${this.api_Url}/api/${this.api_Path}/admin/products/all`)
                .then((res) => {
                    this.products = res.data.products
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
                this.modalProduct = item
                productModal.show()
            }else if (state === 'del'){
                this.modalProduct = item
                delProductModal.show()
            }
        },
        // updateProduct(){
        //     let url = `${this.api_Url}/api/${this.api_Path}/admin/product`;
        //     let way = 'post';
      
        //     if (this.state !== 'isNew') {
        //       url = `${this.api_Url}/api/${this.api_Path}/admin/product/${this.modalProduct.id}`;
        //       way = 'put'
        //     }
      
        //     axios[way](url, { data: this.modalProduct }).then((response) => {
        //       alert(response.data.message);
        //       productModal.hide();
        //       this.getProducts();
        //     }).catch((err) => {
        //       alert(err.response.data.message);
        //     })
        //     console.log('產品更新');
        // },
        // delProduct(){
        //     axios.delete(`${this.api_Url}/api/${this.api_Path}/admin/product/${this.modalProduct.id}`)
        //     .then((result) => {
        //         console.log(this.modalProduct.id);
        //         alert(result.data.message)
        //         delProductModal.hide()
        //         this.getProducts()
        //     }).catch((err) => {
        //         alert(err.response.data.message);
        //     });
        // },
        // createImages(){
        //     this.modalProduct.imagesUrl = [];
        //     this.modalProduct.imagesUrl.push('');
        // }
    },
    mounted() {
        axios.defaults.headers.common['Authorization'] = document.cookie.split('=')[1]
        this.checkUser()
    },
})


app.component('productModal',{
    props:['tempProduct'],
    template: '#productModal',
    data() {
        return {

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
    },
});

app.mount('#app')