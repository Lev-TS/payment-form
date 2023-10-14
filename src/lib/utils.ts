export const mockDatabaseQuery = <T>(data: T): Promise<T> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, 500),
  );
};
