interface KeyValuePair<TValue> {
  key: string;
  value: TValue;
}

type KeyedNavLink = {
  key: string;
  name: string;
  url?: string;
  [prop: string]: unknown;
};
