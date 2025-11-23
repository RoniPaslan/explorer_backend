// src/utils/serialize.ts
export const serializeBigInt = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(serializeBigInt);

  if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (typeof obj[key] === "bigint") {
        newObj[key] = obj[key].toString(); // konversi BigInt ke string
      } else {
        newObj[key] = serializeBigInt(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
};
