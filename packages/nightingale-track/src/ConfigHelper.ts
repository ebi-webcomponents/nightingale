import config, { Color } from "./config";

import { Shape } from "./nightingale-track";

export const getShapeByType = (type: string): Shape => {
  if (config[type.toUpperCase()]) {
    return config[type.toUpperCase()].shape;
  }
  const info = Object.values(config).find(
    (typeInfo) => typeInfo.name.toUpperCase() === type.toUpperCase()
  );
  if (info) {
    return info.shape;
  }
  return "rectangle";
};

export const getColorByType = (type: string): Color => {
  if (config[type.toUpperCase()]) {
    return config[type.toUpperCase()].color;
  }
  const info = Object.values(config).find(
    (typeInfo) => typeInfo.name.toUpperCase() === type.toUpperCase()
  );
  if (!info) {
    console.log(type);
  }
  if (info) {
    return info.color;
  }
  return "black";
};
