import {UuRobo} from './UuRobo';

test('UuRobo', () => {
  const ur = new UuRobo('uurobo');
  expect(ur.getName()).toBe('uurobo');
});
