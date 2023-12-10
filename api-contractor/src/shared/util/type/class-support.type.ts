export type MethodsOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type PropertiesOf<T> = Omit<T, MethodsOf<T>>;
