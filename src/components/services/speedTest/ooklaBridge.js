export const OOKLA_ORIGIN = "https://cableone.speedtestcustom.com";

// Ookla's paid embedded widget posts this result to its parent after resultSaved.
// Source: https://c.speedtestcustom.com/static/js/testBundle.js
export const OOKLA_HTML = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body,iframe{margin:0;padding:0;width:100%;height:100%;border:0;background:white}html,body{overflow:hidden}iframe{display:block}</style>
</head><body><script>
window.addEventListener('message', function(event) {
  var frame = document.getElementById('ookla');
  if (!frame || event.source !== frame.contentWindow || event.origin !== '${OOKLA_ORIGIN}') return;
  var result = event.data;
  if (!result || !result.config || !result.config.testId || !result.end || !result.end.timestamp) return;
  if (result.device && result.device.platform === 'speedtest-custom' && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'ookla-complete', result:result}));
  }
});
</script><iframe scrolling="no" id="ookla" title="Sparklight WiFi speed test" src="${OOKLA_ORIGIN}" allow="geolocation"></iframe></body></html>`;

const measurement = (value) => {
  if (
    !["number", "string"].includes(typeof value) ||
    String(value).trim() === "" ||
    !Number.isFinite(Number(value)) ||
    Number(value) < 0
  ) {
    throw new Error("Invalid Ookla measurement");
  }
  return Number(value);
};
export const parseOoklaCompletion = (raw) => {
  const message = JSON.parse(raw);
  if (message?.type !== "ookla-complete") return null;
  const data = message.result;
  if (
    data?.device?.platform !== "speedtest-custom" ||
    !data?.config?.testId ||
    !data?.end?.timestamp
  )
    return null;
  const divisor = { Kbps: 1000, Mbps: 1, bps: 1000000 }[data.units];
  if (!divisor) throw new Error("Unknown Ookla speed units");
  return {
    testId: String(data.config.testId),
    download: measurement(data.download) / divisor,
    upload: measurement(data.upload) / divisor,
    ping:
      data.latency?.minimum == null ? null : measurement(data.latency.minimum),
    jitter:
      data.latency?.jitter == null ? null : measurement(data.latency.jitter),
    host: typeof data.config.host === "string" ? data.config.host : null,
  };
};
