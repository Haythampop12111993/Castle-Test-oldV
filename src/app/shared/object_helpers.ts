export const removeNullishFieldsParams = (params: any) => {
  // Return empty object if params is null or undefined
  if (params === null || params === undefined) {
    return {};
  }

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.length === 0) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete params[key];
    }
  });

  return params;
};
