// JSX CANNOT WRITE `@click` OR `:class`. alpine({'@click':'toggle'}) SPREADS ANY ATTRIBUTE NAME.
export const alpine = (attrs: Record<string, string>): Record<string, string> => attrs
