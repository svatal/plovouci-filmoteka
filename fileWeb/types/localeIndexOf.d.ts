declare module "locale-index-of" {
  export default function(
    intl: any
  ): ((
    string: string,
    substring: string,
    localesOrCollator?: string | string[],
    options?: Intl.CollatorOptions
  ) => number) &
    ((
      string: string,
      substring: string,
      localesOrCollator: Intl.Collator
    ) => number);
}
