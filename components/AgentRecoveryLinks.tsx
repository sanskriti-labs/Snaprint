/**
 * Visually hidden recovery links for a 404 page. Ora/agent crawlers that
 * fetch raw HTML (not the Accept: text/markdown negotiated response  --  see
 * app/[...markdown routes]) get a short, parseable list of where to look
 * next even when they don't render CSS or JS. `sr-only`, not
 * `hidden`/`display:none`  --  screen readers and most crawlers still read it.
 */
export default function AgentRecoveryLinks({
  extraLink,
}: {
  extraLink?: { href: string; label: string };
}) {
  return (
    <div className="sr-only">
      <p>404  --  this page does not exist on snaprints.com.</p>
      <p>Where to look next:</p>
      <ul>
        <li><a href="/sitemap.xml">/sitemap.xml</a>  --  full sitemap of all live pages</li>
        <li><a href="/llms.txt">/llms.txt</a>  --  site description and page index for AI agents</li>
        <li><a href="/">/</a>  --  homepage</li>
        {extraLink && (
          <li><a href={extraLink.href}>{extraLink.label}</a></li>
        )}
        <li><a href="/find-snaprint">/find-snaprint</a>  --  live Snaprint kiosk locations</li>
      </ul>
    </div>
  );
}
