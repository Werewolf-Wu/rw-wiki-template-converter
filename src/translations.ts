import data from './data/translations.json';
import { relations } from './data/relationships';
import type { MappingKind, TranslationData } from './types';

export const mappingKinds: readonly MappingKind[] = ['creatures', 'regions', 'roles', 'images', 'phrases', 'relations'];

export const own = (object: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(object, key);

const translations: TranslationData = { ...data, relations };
export default translations;
