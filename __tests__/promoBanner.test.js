import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
const RN = require('react-native');

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('../src/res/svgIcons/SignSaveCheckIcon', () => 'SignSaveCheckIcon');
jest.mock('../src/components/common/ProfileSettingsHeader', () => ({ HEADER_GRADIENT: { colors: ['#000', '#111'] } }));

const PromoBanner = require('../src/components/ACPDashboard/PromoBanner').default;

describe('PromoBanner', () => {
  const render = () => {
    let tree;
    act(() => { tree = renderer.create(<PromoBanner />); });
    return tree;
  };
  const layout = (tree, width) => act(() => tree.root.findByType('LinearGradient').props.onLayout({ nativeEvent: { layout: { width } } }));
  const title = (tree) => tree.root.findAllByType(Text).find((t) => t.props.numberOfLines === 2);
  const fontSize = (tree) => [].concat(title(tree).props.style).find((s) => s && s.fontSize).fontSize;

  it('draws the header gradient with the check icon and one sentence at one size', () => {
    const tree = render();
    expect(tree.root.findByType('LinearGradient').props.colors).toEqual(['#000', '#111']);
    expect(tree.root.findAllByType('SignSaveCheckIcon')).toHaveLength(1);
    const sentence = [].concat(title(tree).props.children).map((c) => (typeof c === 'string' ? c : [].concat(c.props.children).join(''))).join('');
    expect(sentence.replace(/\u00A0/g, ' ')).toBe('Sign up today and save with Auto Pay and Paperless Billing');
    const label = tree.root.findByType('LinearGradient').props.accessibilityLabel;
    expect(label).toBe('Sign up today and save with Auto Pay and Paperless Billing');
  });

  it('keeps the button label size on every phone width', () => {
    jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({ width: 440, height: 956 });
    const tree = render();
    layout(tree, 360);
    expect(fontSize(tree)).toBe(18);
    expect(tree.root.findByType('SignSaveCheckIcon').props.size).toBe(36);
  });

  it('scales up proportionally on tablets', () => {
    jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({ width: 834, height: 1194 });
    const tree = render();
    layout(tree, 654.8);
    expect(fontSize(tree)).toBeCloseTo(28.8, 1);
    expect(tree.root.findByType('SignSaveCheckIcon').props.size).toBeCloseTo(57.6, 1);
    layout(tree, 1200);
    expect(fontSize(tree)).toBeCloseTo(28.8, 1);
  });
});
