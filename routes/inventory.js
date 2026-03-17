var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventory');

router.get('/', async function (req, res, next) {
	let result = await inventoryModel.find({}).populate({
		path: 'product',
		select: 'title slug price category isDeleted'
	});
	res.send(result);
});

router.get('/:id', async function (req, res, next) {
	try {
		let id = req.params.id;
		let result = await inventoryModel.findById(id).populate({
			path: 'product',
			select: 'title slug price category isDeleted'
		});

		if (!result) {
			return res.status(404).send({ message: 'ID NOT FOUND' });
		}

		res.send(result);
	} catch (error) {
		res.status(404).send({ message: error.message });
	}
});

router.post('/add-stock', async function (req, res, next) {
	try {
		let product = req.body.product;
		let quantity = Number(req.body.quantity);

		if (!product || !quantity || quantity <= 0) {
			return res.status(400).send({ message: 'quantity phai lon hon 0' });
		}

		let updated = await inventoryModel.findOneAndUpdate(
			{ product: product },
			{ $inc: { stock: quantity } },
			{ new: true }
		).populate({
			path: 'product',
			select: 'title slug price category isDeleted'
		});

		if (!updated) {
			return res.status(404).send({ message: 'INVENTORY NOT FOUND' });
		}

		res.send(updated);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.post('/remove-stock', async function (req, res, next) {
	try {
		let product = req.body.product;
		let quantity = Number(req.body.quantity);

		if (!product || !quantity || quantity <= 0) {
			return res.status(400).send({ message: 'quantity phai lon hon 0' });
		}

		let updated = await inventoryModel.findOneAndUpdate(
			{ product: product, stock: { $gte: quantity } },
			{ $inc: { stock: -quantity } },
			{ new: true }
		).populate({
			path: 'product',
			select: 'title slug price category isDeleted'
		});

		if (!updated) {
			return res.status(400).send({ message: 'Khong du stock' });
		}

		res.send(updated);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.post('/reservation', async function (req, res, next) {
	try {
		let product = req.body.product;
		let quantity = Number(req.body.quantity);

		if (!product || !quantity || quantity <= 0) {
			return res.status(400).send({ message: 'product va quantity > 0 la bat buoc' });
		}

		let updated = await inventoryModel.findOneAndUpdate(
			{ product: product, stock: { $gte: quantity } },
			{ $inc: { stock: -quantity, reserved: quantity } },
			{ new: true }
		).populate({
			path: 'product',
			select: 'title slug price category isDeleted'
		});

		if (!updated) {
			return res.status(400).send({ message: 'Khong du stock hoac inventory khong ton tai' });
		}

		res.send(updated);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.post('/sold', async function (req, res, next) {
	try {
		let product = req.body.product;
		let quantity = Number(req.body.quantity);

		if (!product || !quantity || quantity <= 0) {
			return res.status(400).send({ message: 'product va quantity > 0 la bat buoc' });
		}

		let updated = await inventoryModel.findOneAndUpdate(
			{ product: product, reserved: { $gte: quantity } },
			{ $inc: { reserved: -quantity, soldCount: quantity } },
			{ new: true }
		).populate({
			path: 'product',
			select: 'title slug price category isDeleted'
		});

		if (!updated) {
			return res.status(400).send({ message: 'Khong du reserved hoac inventory khong ton tai' });
		}

		res.send(updated);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

module.exports = router;
