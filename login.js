import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const app = {
    data() {
        return {
           username: "",
           password: "",
        //    apiPath: ""
        }
    },
    methods: {
        login(){
            const url = "https://ec-course-api.hexschool.io/v2/admin/signin"
            axios.post(url, {
                username: this.username,
                password: this.password
            }).then((res) => {
                const { token, expired } = res.data
                
                document.cookie = `token=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html'
            }).catch((err) => {
                console.log(err);
            });
        }
    },
}

createApp(app).mount('#app')