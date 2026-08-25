/**
 * 设计提示：盲域极简主义——页面仅作为透明的全屏画框，不与 Canvas 的黑场争夺注意力。
 */
export default function Home() {
  return (
    <main className="sonar-shell" aria-label="回声 Sonar 游戏">
      <iframe className="sonar-frame" src={`/echo.html${window.location.search}`} title="回声 Sonar" />
    </main>
  );
}
