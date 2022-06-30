import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import initiativeTrees from "../../models/initiative-trees.model";
import trees from "../../models/trees.model";
import sequelize from "sequelize";
import initiativeLocations from "../../models/initiative-location.model";
import city from "../../models/city.model";
import { UserController } from "../dashboard/user.controller";
import tripCart from "../../models/trip-cart.model";
export class EventCartController {
  constructor() {}
  public async addOrUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await new UserController().getUserData(req.cookies.token);
      const where = { user_id: user['user_id'], trip_id: req.body.tripId };
      if (Number(req.body.tripId) <= 0 || Number(req.body.qty) <= 0) {
        return res.status(httpStatus.BAD_REQUEST).json({ msg: "QTY should be greater than `zero` " });
      } else {
        const data = tripCart.findOrCreate({ where, defaults: { ...where, qty: req.body.qty } });
        if (!data[1]) {
          const updatedCart = tripCart.update({ qty: req.body.qty }, { where });
          if (updatedCart) return res.status(httpStatus.OK).json({ msg: "update successfully" });
          else return res.status(httpStatus.NOT_FOUND).json({ msg: "Error happend" });
        } else {
          return res.status(httpStatus.OK).json({ msg: "Add successfully" });
        }
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't add or update cart" });
    }
  }
  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await new UserController().getUserData(req.cookies.token);
      const where = { user_id: user["user_id"], tree_id: req.params.treeId };
      await tripCart.destroy({ where });
      return res.status(httpStatus.OK).json({ msg: "Remove successfully" });
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Error happend" });
    }
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = req["lang"] == "en";
      const langName = lang ? "en_name" : "ar_name";
      const locationName = lang ? "location_nameEn" : "location_nameAr";
      const user = await new UserController().getUserData(req.cookies.token);
      const data: any[] = await tripCart.findAll({
          where: { user_id: user["user_id"] },
          attributes: ["id", "qty",
            [sequelize.col("tbl_initiatives_tree.id"), "treeId"],
            [sequelize.col("tbl_initiatives_tree.carbon_points"), "carbon"],
            [sequelize.col("tbl_initiatives_tree.price"), "price"],
            [sequelize.col("tbl_initiatives_tree.status"), "status"],
            [sequelize.col("tbl_initiatives_tree.deleted"), "deleted"],
            [sequelize.col("tbl_initiatives_tree.tbl_tree.tree_id"), "treeIdInfo"],
            [sequelize.col("tbl_initiatives_tree.tbl_tree.img_tree"), "img"],
            [sequelize.col(`tbl_initiatives_tree.tbl_tree.${langName}`), "name"],
            [sequelize.literal("(`tbl_initiatives_tree`.`price` * `tbl_cart`.`qty`)"), "itemTotal"],
            [sequelize.col(`tbl_initiatives_tree.tbl_initiatives_location.${locationName}`), "locationName"],
            [sequelize.col(`tbl_initiatives_tree.tbl_initiatives_location.tbl_city.${langName}`), "cityName"],
            [
              sequelize.literal(`(
                SELECT COALESCE(target_num,0)
                -
                (SELECT COALESCE(SUM(tbl_orders_details.quantity),0)
                FROM tbl_orders_details,tbl_orders
                WHERE tbl_orders_details.tree_id = tbl_cart.tree_id AND tbl_orders.status = "inprogress")
                )`),
              "stock",
            ],
          ],
          include: [{
              model: initiativeTrees,
              attributes: [],
              include: [
                { model: trees, attributes: [] },
                { model: initiativeLocations, attributes: [], include: [{ model: city, attributes: [] }] },
              ],
          }],
          raw: true,
      });
      if (data) {
        const amountTotal: number = data.reduce((total, currentValue) => { return total + currentValue.itemTotal }, 0);
        const cartItems = { amountTotal, data };
        return res.status(httpStatus.OK).json(cartItems);
      }
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "error in get list cart", err: error });
    }
  }
  public async check(user: any) {
    try {
      const userId = user;
      const data: any[] = await tripCart.findAll({
        where: {user_id: userId},
        attributes: [
          "id",
          ["qty", "quantity"],
          [sequelize.col("tbl_initiatives_tree.id"), "tree_id"],
          [sequelize.col("tbl_initiatives_tree.carbon_points"), "carbon"],
          [sequelize.col("tbl_initiatives_tree.price_points"), "sahlanPoint"],
          [sequelize.col("tbl_initiatives_tree.location_id"), "location_id"],
          [sequelize.col("tbl_initiatives_tree.init_id_pk"), "initiative_id"],
          [sequelize.col("tbl_initiatives_tree.price"), "price"],
          [sequelize.col("tbl_initiatives_tree.status"), "status"],
          [sequelize.col("tbl_initiatives_tree.deleted"), "deleted"],
          [sequelize.literal("(`tbl_initiatives_tree`.`price` * `tbl_cart`.`qty`)"), "itemTotal"],
          [
            sequelize.literal(`(
              SELECT COALESCE(target_num,0)
              -
              (SELECT COALESCE(SUM(tbl_orders_details.quantity),0)
              FROM tbl_orders_details,tbl_orders
              WHERE tbl_orders_details.tree_id = tbl_cart.tree_id AND tbl_orders.status = "inprogress")
              )`),
            "stock",
          ],
        ],
        include: [
          {
            model: initiativeTrees,
            attributes: [],
            include: [
              { model: trees, attributes: [] },
              { model: initiativeLocations, attributes: [], include: [{ model: city, attributes: [] }] },
            ],
          },
        ],
        raw: true,
      });
      let result;
      if (data) {
        const amountTotal: number = data.reduce((total, currentValue) => { return total + currentValue.itemTotal; }, 0);
        const totalSahlanPoint: number = data.reduce((total, currentValue) => { return total + currentValue.sahlanPoint * currentValue.quantity; }, 0);
        const totalCarbonPoint: number = data.reduce((total, currentValue) => { return total + currentValue.carbon * currentValue.quantity; }, 0);
        const cartItems = { totalSahlanPoint, totalCarbonPoint, amountTotal, data };
        result = cartItems;
      } else result = null;
      return result;
    } catch (error) {
      throw error;
    }
  }
  public async count(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await new UserController().getUserData(req.cookies.token);
      const cartCount = await new EventCartController().cardCount(user["user_id"]);
      return res.status(httpStatus.OK).json({ cartCount });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't count user carts", err: error });
    }
  }
  private async cardCount(userId) {
    try {
      return await tripCart.count({ where: { user_id: userId } });
    } catch (error) {
      throw error;
    }
  }
}
