import {describe, expect, it} from 'vitest';
import {localize} from './localize';

describe('localize', () => {
  it('translates with the given language', () => {
    expect(localize('ERROR.NO_ENTITY', 'es')).toBe('No se ha definido ninguna entidad');
    expect(localize('ERROR.NO_ENTITY', 'ca')).toBe("No s'ha definit cap entitat");
  });

  it('falls back to the base language of a regional code', () => {
    expect(localize('ERROR.NO_ENTITY', 'es-ES')).toBe('No se ha definido ninguna entidad');
    expect(localize('ERROR.NO_ENTITY', 'ca_ES')).toBe("No s'ha definit cap entitat");
  });

  it('falls back to English for unknown languages', () => {
    expect(localize('ERROR.NO_ENTITY', 'xx')).toBe('No Entity Defined');
    expect(localize('ERROR.NO_ENTITY')).toBe('No Entity Defined');
  });

  it('returns the key instead of throwing when it does not exist', () => {
    expect(localize('DOES.NOT.EXIST', 'es')).toBe('DOES.NOT.EXIST');
    expect(localize('ERROR', 'es')).toBe('ERROR');
  });

  it('replaces placeholders', () => {
    expect(localize('ERROR.ENTITY_NOT_FOUND', 'en', {entity: 'sensor.rain'})).toBe('Entity not found: sensor.rain');
  });
});
