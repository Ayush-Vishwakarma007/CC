const express = require('express'); // express.js
const rendertron = require('rendertron-middleware'); // The Rendertron middle were
const APP_FOLDER = 'dist/CCAngularPlateform'; // The folder for the deployment
const PORT = process.env.PORT || 4001; // Get Port from the env
const RENDERTRON_URL = process.env.RENDERTRON_URL || "http://52.12.59.238:3020/render"; // Rendertron URL from  env

const app = express();

app.use(rendertron.makeMiddleware({
  proxyUrl: RENDERTRON_URL, // middle were path
}));

app.use(express.static(APP_FOLDER));
// Adding Way to render angular sub pages run time
app.all("*",function(req,res){
    res.status(200).sendFile(`/`, {root: APP_FOLDER});
})
// Start Server
app.listen(PORT,function(){
    console.log("APP Started Running on port "+PORT+" Using The Following Server as middelwere "+RENDERTRON_URL)
});
