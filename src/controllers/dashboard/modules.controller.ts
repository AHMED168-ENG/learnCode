import modules from "../../models/module.model";
export class ModulesController {
  constructor() {}
  public async getModules() {
    try {
      return await modules.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
    } catch (error) {
      throw error;
    }
  }
  public async getModuleIdByName(name: string): Promise<string> {
    try {
      const module = await modules.findOne({ attributes: ["id"], where: { name } }) || {};
      return module["id"];
    } catch (error) {
      throw error;
    }
  }
}
