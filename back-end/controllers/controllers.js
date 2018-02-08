const index = require('../models/index');
const Op = index.Sequelize.Op;

let Blog = index.models.Blog;
let Product = index.models.Product;
let Order = index.models.Order;
let Order_detail = index.models.Order_detail;

let getBlogs = (response) => { // this return back all the blogs //
	Blog.find({}, null, {sort:{date: -1}}, (err, results) => {
		response.json(results)});
};

let getBlog = (request, response) => { // this return the single blog //
	Blog.findOne({_id: request.params.id}).then((result) => response.json(result));
};

let getProducts = (response) => {  // this return all the product //

	Product.findAll({where:{quantity: {[Op.gt]: 0} }}).then(results => response.json(results));
};

let getProduct = (request, response) => { // this return the single product //
	Product.findOne({where: {product_id: request.params.id}}).then((result) => response.json(result));
};

let addProduct = (request, response) => { // this add a product // 
	Product.create({
		name: request.body.name,
		description: request.body.description,
		price: request.body.price,
		image_url: request.body.image_url,
		quantity: request.body.quantity
	}, {plain: true}).then((newProduct) => response.json(newProduct));	
};

let putProduct = (request, response) => { // this edit the product //
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

let deleteProduct = (request, response) => { // this delete the product  // 
	Product.destroy({where: {product_id: request.params.id}})
	.then((numberOfDeletedProducts) => response.json(numberOfDeletedProducts));
};

let checkQuantity = (request, response) => { // this check if a user requesting if the product more than the inventory //
	index.sequelize.query(`SELECT * FROM products WHERE product_id ='${request.query.id}'`)
		.then((result) => {
			console.log(result[0][0]);
			if (result[0][0]) {
				response.json({quantity: result[0][0].quantity});
			} else {
				response.json({quantity: 0});
			};
		});
};

let placeOrder = (request, response) => { // placing an order from the shopping cart //
	let userId;
	if (request.body[1].length) {
		/*console.log("there is user id", request.body[1]);
		console.log("there is user id", request.body[0]);*/
		userId = request.body[1][0].userID;
	} /*else {
		console.log("no user id", request.body[1]);
		console.log("no user id", request.body[0]);
	}*/;
	let total = 0, products = [];
	for (itemDetail of request.body[0]){
		total += itemDetail.total * itemDetail.quantity;
		products.push({
			product_id: itemDetail.productID,
			quantity: itemDetail.quantity
		});
		index.sequelize.query(`UPDATE products SET quantity = quantity - '${itemDetail.quantity}' WHERE products.product_id = '${itemDetail.productID}'`);
	};
	if (userId) {
		Order.create({
			total: total,
			order_date: Date(),
			user_id: userId
		})
		.then((result) => {
			addingOrderNum (products, result.dataValues.order_num);
			Order_detail.bulkCreate(products)
				.then(response.json({orderStatus: 'success'}));
		});
	} else {
		Order.create({
			total: total,
			order_date: Date()
		})
		.then((result) => {
		addingOrderNum (products, result.dataValues.order_num);
		Order_detail.bulkCreate(products)
			.then(response.json({orderStatus: 'success'}));
	});
	};
	
	let addingOrderNum = (products, orderNum) => {
		for (let i = 0; i < products.length; i++) {
			products[i]['order_num'] = orderNum;
		};
	};
};

let checkAdmin = (request, response) => {
	index.sequelize.query(`SELECT admin from users where user_id = '${request.params.id}'`)
		.then((result) => {
			if (result[0][0]) {
				response.json(result[0][0]);
			} else {
				response.json({admin:false});
			};	
		});
};

module.exports.getBlogs = getBlogs;
module.exports.getBlog = getBlog;
module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.putProduct = putProduct;
module.exports.deleteProduct = deleteProduct;
module.exports. checkQuantity = checkQuantity;
module.exports.placeOrder = placeOrder;
module.exports.checkAdmin = checkAdmin;
