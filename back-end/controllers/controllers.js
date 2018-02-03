const models = require('../models/index').models;

let Blog = models.Blog;
let Product = models.Product;

let getBlogs = (response) => {
	// blog = new Blog();
	// blog.blogTitle = `random ${Math.random()}`;
	// blog.blogBody = `lorem Epsom ${Math.random()}`;
	// blog.date = Date();
	// blog.save();

	Blog.find({}, null, {sort:{date: -1}}, (err, results) => {
		response.json(results)});
};

let getBlog = (request, response) => {
	Blog.findOne({_id: request.params.id}).then((result) => response.json(result));
};

let getProducts = (response) => {  

	Product.findAll().then(results => response.json(results));
};

let getProduct = (request, response) => {
	Product.findOne({where: {product_id: request.params.id}}).then((result) => response.json(result));
};

let addProduct = (request, response) => {
	Product.create({
		name: request.body.name,
		description: request.body.description,
		price: request.body.price,
		image_url: request.body.image_url,
		quantity: request.body.quantity
	}, {plain: true}).then((newProduct) => response.json(newProduct));	
};

let putProduct = (request, response) => {
	console.log(request.params);
	Product.update({
		name: request.body.name,
		description: request.body.description,
		price: request.body.price,
		image_url: request.body.image_url,
		quantity: request.body.quantity
	},{
		where: {product_id: request.params.id},
		returning: true,
		plain: true
	}).then((updatedProduct) => response.json(updatedProduct));
};

module.exports.getBlogs = getBlogs;
module.exports.getBlog = getBlog;
module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.putProduct = putProduct;