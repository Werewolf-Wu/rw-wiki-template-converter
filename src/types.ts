export type MappingKind = 'creatures' | 'regions' | 'roles' | 'images' | 'phrases' | 'relations';
export type TranslationData = Record<MappingKind, Record<string, string>>;
export type TranslationOverrides = Partial<TranslationData>;

export interface ConversionWarning {
  field: string;
  message: string;
}
export interface UnresolvedTranslation {
  kind: MappingKind;
  source: string;
  field: string;
}
export interface ConversionResult {
  output: string;
  warnings: ConversionWarning[];
  unresolved: UnresolvedTranslation[];
  changed: number;
}
export interface ConverterDefinition {
  id: string;
  title: string;
  description: string;
  sourceLabel: string;
  outputLabel: string;
  example: string;
  convert: (text: string, overrides?: TranslationOverrides) => ConversionResult;
}
