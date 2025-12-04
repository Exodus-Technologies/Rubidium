import {
  createIssueSubId,
  createSubscriptionId,
  createVideoSubId,
  removeSpaces,
  removeSpecialCharacters
} from './strings';

describe('strings utilities', () => {
  test('id creators produce prefixed ids', () => {
    const s = createSubscriptionId();
    expect(s.startsWith('subscription-')).toBe(true);
    const v = createVideoSubId();
    expect(v.startsWith('video-')).toBe(true);
    const i = createIssueSubId();
    expect(i.startsWith('issue-')).toBe(true);
  });

  test('removeSpaces and removeSpecialCharacters behave correctly', () => {
    expect(removeSpaces('a b c')).toBe('abc');
    expect(removeSpecialCharacters('a$1!b')).toBe('ab');
  });
});
