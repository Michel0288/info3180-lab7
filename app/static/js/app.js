/* Add your Application JavaScript */
// Instantiate our main Vue Instance

const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload Form <span class="sr-only">(current)</span></router-link>
        </li>
        </ul>
      </div>
    </nav>
    `
});
const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

app.component("upload-form", {
    name: 'UploadForm',
    template:`
        <h1>Upload Form</h1>
        <div>
            <form @submit.prevent="uploadPhoto" id="uploadForm">
                <div id = "message">
                    <p class="alert alert-success" v-if="message === 'success'" >{{success}}</p>
                    <ul class="alert alert-danger" v-if="message === 'error'" >
                        <li v-for="errors in errors" > {{errors}}</li>
                    </ul> 
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea name="description" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label for="photo">Photo</label>
                    <input name="photo" class="form-control-file" type="file">
                </div><br>
                <button type=submit class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    methods: {
        uploadPhoto: function(){
            self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            
            fetch("/api/upload", {
                method: "POST",
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                // self.outcome = 'success';
                // self.success = jsonResponse.data.message;
                if ('data' in jsonResponse ){
                    self.success = jsonResponse.data.message;
                    self.message = 'success';
                    console.log(jsonResponse)
                } else if ('errormessage' in jsonResponse ){
                    console.log(jsonResponse)
                    self.errors = jsonResponse.errormessage.errors;
                    self.message = 'error';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    data() {
        return {
            message: '',
            errors: [],
            success:[]
        }
    }
});
const UploadForm = app.component("upload-form");
//Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    { path:"/upload",component:UploadForm},
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});


app.use(router);

app.mount('#app');