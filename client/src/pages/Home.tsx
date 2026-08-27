/**
 * 设计提示：盲域极简主义——页面仅作为透明的全屏画框，不与 Canvas 的黑场争夺注意力。
 */
export default function Home() {
  const allowedPreviewKeys = new Set([
    "demo", "archive", "replay", "ending", "settings", "threat", "silence", "coop", "relay", "far", "trial", "decoy", "mode", "link", "remap", "abort",
  ]);
  const rawQuery = new URLSearchParams(window.location.search);
  const gameQuery = new URLSearchParams();
  rawQuery.forEach((value, key) => {
    if (allowedPreviewKeys.has(key)) gameQuery.append(key, value);
  });
  const gameSrc = `/echo.html${gameQuery.size ? `?${gameQuery.toString()}` : ""}`;

  return (
    <main className="sonar-shell" aria-label="回声 Sonar 游戏">
      <iframe
        key={gameSrc}
        className="sonar-frame"
        src={gameSrc}
        title="回声 Sonar"
        onLoad={(event) => {
          event.currentTarget.focus();
          event.currentTarget.contentWindow?.postMessage({ type: "sonar-focus" }, window.location.origin);
        }}
      />
    </main>
  );
}
