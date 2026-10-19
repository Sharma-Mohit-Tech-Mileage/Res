import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';

jest.mock('@react-native-community/checkbox', () => 'CheckBox');
jest.mock('react-native-config', () => ({}));
jest.mock('../src/res/svgIcons/AlertIcon', () => 'AlertIcon');
jest.mock('../src/utils/a11y', () => ({ setFocusToRef: jest.fn() }));

const { normalizePhoneDigits, isSamePhoneNumber, isCompletePhoneNumber, TEXT_DISCLAIMER_SUBSCRIBED, CONSENT_LABEL, CONSENT_LABEL_WITH_ERROR } = require('../src/utils/textConsent');
const { useTextConsent, TextConsentCheckbox, TextConsentLinks } = require('../src/components/common/TextConsent');
const { setFocusToRef } = require('../src/utils/a11y');

describe('phone number helpers', () => {
  it('compares numbers by digits and ignores a leading US country code', () => {
    expect(normalizePhoneDigits('(555) 123-4567')).toBe('5551234567');
    expect(normalizePhoneDigits('+1 555 123 4567')).toBe('5551234567');
    expect(isSamePhoneNumber('15551234567', '555-123-4567')).toBe(true);
    expect(isSamePhoneNumber('5551234567', '5551234568')).toBe(false);
    expect(isCompletePhoneNumber('555123456')).toBe(false);
    expect(isCompletePhoneNumber('1 (555) 123-4567')).toBe(true);
    expect(normalizePhoneDigits(undefined)).toBe('');
  });

  it('uses the real Sparklight support number in the disclaimer', () => {
    expect(TEXT_DISCLAIMER_SUBSCRIBED).toContain('1-877-692-2253');
    expect(TEXT_DISCLAIMER_SUBSCRIBED).not.toContain('123-0456');
  });
});

describe('useTextConsent', () => {
  let consent;
  const Probe = (props) => {
    consent = useTextConsent(props);
    return null;
  };
  let tree;
  const render = (props) => act(() => { tree = renderer.create(<Probe {...props} />); });
  const update = (props) => act(() => tree.update(<Probe {...props} />));

  beforeEach(() => jest.clearAllMocks());

  it('always requires consent when adding a number', () => {
    render({ savedNumber: '', currentNumber: '' });
    expect(consent.required).toBe(true);
  });

  it('requires consent only while the number differs from the saved one', () => {
    render({ savedNumber: '15551234567', currentNumber: '(555) 123-4567' });
    expect(consent.required).toBe(false);
    update({ savedNumber: '15551234567', currentNumber: '5559876543' });
    expect(consent.required).toBe(true);
    act(() => consent.onChange(true));
    expect(consent.checked).toBe(true);
    update({ savedNumber: '15551234567', currentNumber: '5551234567' });
    expect(consent.required).toBe(false);
    expect(consent.checked).toBe(false);
  });

  it('clears the tick when the number changes after agreeing', () => {
    render({ savedNumber: '', currentNumber: '5559876543' });
    act(() => consent.onChange(true));
    update({ savedNumber: '', currentNumber: '555987654' });
    expect(consent.checked).toBe(false);
  });

  it('keeps an early tick while the first number is still being typed', () => {
    render({ savedNumber: '', currentNumber: '' });
    act(() => consent.onChange(true));
    update({ savedNumber: '', currentNumber: '555' });
    update({ savedNumber: '', currentNumber: '5559876543' });
    expect(consent.checked).toBe(true);
    update({ savedNumber: '', currentNumber: '5559876540' });
    expect(consent.checked).toBe(false);
  });

  it('blocks saving until agreed, moves focus to the checkbox and clears the error on tick', () => {
    render({ savedNumber: '', currentNumber: '5559876543' });
    let ok;
    act(() => { ok = consent.validate(); });
    expect(ok).toBe(false);
    expect(consent.showError).toBe(true);
    expect(setFocusToRef).toHaveBeenCalledTimes(1);
    expect(setFocusToRef).toHaveBeenCalledWith(consent.checkboxRef, { delay: 400 });
    act(() => consent.onChange(true));
    expect(consent.showError).toBe(false);
    act(() => { ok = consent.validate(); });
    expect(ok).toBe(true);
  });

  it('can flag the error without stealing focus from another field', () => {
    render({ savedNumber: '', currentNumber: '' });
    act(() => { consent.validate({ focus: false }); });
    expect(consent.showError).toBe(true);
    expect(setFocusToRef).not.toHaveBeenCalled();
  });

  it('passes validation without a checkbox when the number is unchanged', () => {
    render({ savedNumber: '5551234567', currentNumber: '5551234567' });
    expect(consent.validate()).toBe(true);
  });

  it('honours alwaysRequired even when a saved number matches', () => {
    render({ savedNumber: '5551234567', currentNumber: '5551234567', alwaysRequired: true });
    expect(consent.required).toBe(true);
  });
});

describe('TextConsentCheckbox', () => {
  const navigation = { navigate: jest.fn() };
  const render = (consent) => {
    let tree;
    act(() => { tree = renderer.create(<TextConsentCheckbox consent={{ checkboxRef: { current: null }, showError: false, checked: false, onChange: jest.fn(), ...consent }} navigation={navigation} />); });
    return tree;
  };
  const row = (tree) => tree.root.findByProps({ testID: 'textConsentCheckbox', accessibilityRole: 'checkbox' });
  const link = (tree, text) => tree.root.findAllByType(Text).find((t) => t.props.children === text && t.props.onPress);

  beforeEach(() => jest.clearAllMocks());

  it('reads as one checkbox with the full sentence and toggles on tap', () => {
    const onChange = jest.fn();
    const tree = render({ onChange });
    expect(row(tree).props.accessibilityLabel).toBe(CONSENT_LABEL);
    expect(row(tree).props.accessibilityState).toMatchObject({ checked: false });
    act(() => row(tree).props.onPress());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('keeps the sentence out of the checkbox target, which stays 48dp', () => {
    const tree = render();
    expect(row(tree).props.children.props.disabled).toBe(true);
    expect(row(tree).findAllByType(Text).length).toBe(0);
    const style = Object.assign({}, ...[].concat(row(tree).props.style).filter(Boolean));
    expect(style).toMatchObject({ width: 48, height: 48 });
  });

  it('opens both documents from the inline links and from screen-reader actions', () => {
    const tree = render();
    act(() => link(tree, 'Text Messaging Terms & Conditions').props.onPress());
    expect(navigation.navigate).toHaveBeenLastCalledWith('ArticleWindowUtility', { url: 'https://www.sparklight.com/legal/text-messaging-terms-and-conditions', name: 'Text Messaging Terms' });
    act(() => link(tree, 'Privacy Policy').props.onPress());
    expect(navigation.navigate).toHaveBeenLastCalledWith('ArticleWindowUtility', { url: 'https://www.sparklight.com/legal/privacy-policy', name: 'Privacy Policy' });
    navigation.navigate.mockClear();
    act(() => row(tree).props.onAccessibilityAction({ nativeEvent: { actionName: 'viewTerms' } }));
    act(() => row(tree).props.onAccessibilityAction({ nativeEvent: { actionName: 'viewPrivacy' } }));
    expect(navigation.navigate).toHaveBeenCalledTimes(2);
  });

  it('reads the inline error as part of the checkbox, not as a separate element', () => {
    expect(row(render()).props.accessibilityLabel).toBe(CONSENT_LABEL);
    const tree = render({ showError: true });
    expect(row(tree).props.accessibilityLabel).toBe(CONSENT_LABEL_WITH_ERROR);
    expect(tree.root.findAllByProps({ importantForAccessibility: 'no-hide-descendants' }).length).toBeGreaterThan(0);
  });
});

describe('TextConsentLinks', () => {
  it('renders the two documents as separate links', () => {
    const navigation = { navigate: jest.fn() };
    let tree;
    act(() => { tree = renderer.create(<TextConsentLinks navigation={navigation} />); });
    const links = tree.root.findAllByProps({ accessibilityRole: 'link' }).filter((n) => typeof n.props.onPress === 'function' && n.props.accessibilityLabel);
    const labels = [...new Set(links.map((n) => n.props.accessibilityLabel))];
    expect(labels).toEqual(['Text Messaging Terms & Conditions', 'Privacy Policy']);
  });
});
