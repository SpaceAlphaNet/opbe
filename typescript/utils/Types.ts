type ObjectMap<K extends string | number | symbol, V> = {
  [key in K]: V;
};

type RfMap = {
  [key in number]: number;
}