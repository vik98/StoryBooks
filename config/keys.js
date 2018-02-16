// Set up google cloud by creating a new project
// Fill the consent thing and then create a oauth client credential
// SET NODE_ENV TO DEVELOPMENT

if(process.env.NODE_ENV === "production"){
  module.exports = require("./keys_prod");
}else{
  module.exports = require("./keys_dev");
}
