import { statblockDataType } from "../statblockTypes";

export default class Resources {
  resourcesMax: { [key: string]: number };
  resources: { [key: string]: number };

  constructor(sbData: statblockDataType) {
    this.resourcesMax = sbData["resources"]!;
    this.resources = structuredClone(this.resourcesMax);
  }

  canUse(resourceKey: string, cost: number) {
    return resourceKey in this.resources && this.resources[resourceKey] >= cost;
  }

  use(resourceKey: string, cost: number) {
    this.resources[resourceKey] -= cost;
  }

  reset(resourceKey: string) {
    this.resources[resourceKey] = this.resourcesMax[resourceKey];
  }
}
