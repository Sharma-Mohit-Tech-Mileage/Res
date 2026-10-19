const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { Platform } = require('react-native');

jest.mock('react-native-webview', () => 'WebView');

describe('WebViewWarmup', () => {
  const WebViewWarmup = require('../src/components/common/WebViewWarmup').default;
  const original = Platform.OS;
  afterEach(() => { Platform.OS = original; jest.useRealTimers(); });

  const render = (url) => {
    let tree;
    act(() => { tree = renderer.create(<WebViewWarmup url={url} />); });
    return tree;
  };

  it('mounts a hidden WebView for the url on Android', () => {
    Platform.OS = 'android';
    const tree = render('https://explainer.example.com/a');
    const web = tree.root.findAllByType('WebView');
    expect(web).toHaveLength(1);
    expect(web[0].props.source).toEqual({ uri: 'https://explainer.example.com/a' });
  });

  it('does nothing on iOS, without a url, or for non-https urls', () => {
    Platform.OS = 'ios';
    expect(render('https://explainer.example.com/a').root.findAllByType('WebView')).toHaveLength(0);
    Platform.OS = 'android';
    expect(render(null).root.findAllByType('WebView')).toHaveLength(0);
    expect(render('http://insecure.example.com').root.findAllByType('WebView')).toHaveLength(0);
  });

  it('unmounts after the page loads and does not warm the same url twice', () => {
    Platform.OS = 'android';
    const tree = render('https://explainer.example.com/a');
    act(() => { tree.root.findByType('WebView').props.onLoadEnd(); });
    expect(tree.root.findAllByType('WebView')).toHaveLength(0);
    act(() => { tree.update(<WebViewWarmup url="https://explainer.example.com/a" />); });
    expect(tree.root.findAllByType('WebView')).toHaveLength(0);
    act(() => { tree.update(<WebViewWarmup url="https://explainer.example.com/b" />); });
    expect(tree.root.findAllByType('WebView')).toHaveLength(1);
  });

  it('gives up after the timeout if the page never finishes', () => {
    jest.useFakeTimers();
    Platform.OS = 'android';
    const tree = render('https://explainer.example.com/a');
    expect(tree.root.findAllByType('WebView')).toHaveLength(1);
    act(() => { jest.advanceTimersByTime(15000); });
    expect(tree.root.findAllByType('WebView')).toHaveLength(0);
  });
});
