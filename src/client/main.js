'use strict';

import $ from "jquery";
import {context} from './context.js'; //Singleton mantains coordinated all classes involved in the app
import {initRouter} from './router.js'; //Knows what to do for every single URL 

import './styles.css'; //Webpack can import CSS files too!
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/toastr/build/toastr.min.css';
import '../../node_modules/font-awesome/css/font-awesome.css';


/** Once the page is loaded we get a context app object an generate students rank view if we are logged otherwise show login template. */
$(document).ready(function(){
  context.isLogged();
  initRouter();
  
});
