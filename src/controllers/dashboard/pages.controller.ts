import page from "../../models/page.model";
export class PagesController {
  constructor() {}
  public async getPages() {
    try {
      return await page.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
    } catch (error) {
      throw error;
    }
  }
}
