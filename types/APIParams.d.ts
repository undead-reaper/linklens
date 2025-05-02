type APIParams = {
  url: string;
  oembed?: boolean;
  timeout?: number;
  follow?: number;
  compress?: boolean;
  size?: number;
  headers?:
    | Headers
    | Record<string, string>
    | Iterable<readonly [string, string]>
    | Iterable<Iterable<string>>;
};
