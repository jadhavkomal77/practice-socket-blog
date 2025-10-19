// utils/checkEmpty.js
export const checkEmpty = (fields) => {
  let error = {};
  let isError = false;

  Object.keys(fields).forEach((key) => {
    if (!fields[key] || fields[key].trim() === "") {
      error[key] = `${key} is required`;
      isError = true;
    }
  });

  return { isError, error };
};
