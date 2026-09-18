import React from 'react';
import renderer, {act} from 'react-test-renderer';
import Internet from '../../src/res/svgIcons/InternetServiceIcon';
import Phone from '../../src/res/svgIcons/PhoneServiceIcon';
import Video from '../../src/res/svgIcons/VideoServiceIcon';
import Usage from '../../src/res/svgIcons/UsageServiceIcon';
import History from '../../src/res/svgIcons/HistoryServiceIcon';
import Equipment from '../../src/res/svgIcons/EquipmentServiceIcon';

// React Test Renderer accepts DOM tags that crash on a native device.
// Inspect the rendered tree as well as mounting each supplied icon.
it.each(Object.entries({Internet, Phone, Video, Usage, History, Equipment}))(
  '%s renders native SVG primitives without browser-only tags',
  (_, Icon) => {
    let screen;
    act(() => { screen = renderer.create(<Icon />); });
    const browserTags = new Set(['svg', 'path', 'rect', 'circle', 'g', 'defs', 'clipPath', 'line', 'mask']);
    expect(screen.root.findAll(node => browserTags.has(node.type))).toHaveLength(0);
    expect(screen.toJSON()).not.toBeNull();
    act(() => screen.unmount());
  },
);
