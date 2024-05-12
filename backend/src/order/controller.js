const Order = require("./model");

const create = async (req, res, next) => {
  const { planner_id, product_id, amount } = req.body;
  if (!planner_id || !product_id || !amount)
    return res.status(404).json({ error: "Credential not complete" });

  try {
    const order = await Order.create({ planner_id, product_id, amount });
    if (!order) throw new Error("Failed to create order");
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  const { planner_id } = req.params;
  try {
    const orders = await Order.find({ planner_id })
      .populate("planner_id")
      .populate("product_id")
      .exec();
    if (!orders) throw new Error("Resource not found");
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ error: "Credential not complete" });

  try {
    const deleteQuery = await Order.findByIdAndDelete(id);
    if (!deleteQuery) throw new Error("Resource not Found");
    res.status(200).json(deleteQuery);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, deleteById };
