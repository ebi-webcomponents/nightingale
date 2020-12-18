import { defineElement } from "@nightingale-elements/nightingale-core";
import NightingaleVCFAdapter, {
  transformData as _transformData,
} from "./nightingale-vcf-adapter";

defineElement(NightingaleVCFAdapter);

export default NightingaleVCFAdapter;
export const transformData = _transformData;
