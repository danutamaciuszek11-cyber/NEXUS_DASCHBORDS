// NEXUS Declarative UI Language (XNL) Parser
// Parses clean declarative XNL structures like:
// <nexus-dashboard>
//   <header>
//     <title>NEXUS DASHBOARD</title>
//     <status>CORE ONLINE</status>
//   </header>
//   <modules>
//     <module id="nexus-bella-os" status="operational" />
//     <module slot="empty" />
//   </modules>
// </nexus-dashboard>

export interface XnlHeader {
  title: string;
  status: string;
}

export interface XnlModuleNode {
  id?: string;
  status?: string;
  slot?: string; // e.g. "empty"
}

export interface XnlAst {
  tag: 'nexus-dashboard';
  header?: XnlHeader;
  modules: XnlModuleNode[];
}

export class XnlParser {
  /**
   * Generates default canonical XNL representation from active module IDs
   */
  static generateDefaultXnl(moduleIds: string[]): string {
    const modulesXml = moduleIds
      .map((id) => `        <module id="${id}" status="operational" />`)
      .join('\n');

    return `<nexus-dashboard>

    <header>
        <title>NEXUS DASHBOARD</title>
        <status>CORE ONLINE</status>
    </header>

    <modules>

${modulesXml}

        <module slot="empty" />

    </modules>

</nexus-dashboard>`;
  }

  /**
   * Parses an XNL text string into structured JavaScript representation
   */
  static parse(xnlString: string): XnlAst {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xnlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.warn('XNL Parse Error:', parserError.textContent);
      // Fallback simple regex or standard tree
      return this.fallbackParse(xnlString);
    }

    const root = doc.querySelector('nexus-dashboard');
    if (!root) {
      return { tag: 'nexus-dashboard', modules: [{ slot: 'empty' }] };
    }

    const titleEl = root.querySelector('header > title');
    const statusEl = root.querySelector('header > status');

    const header: XnlHeader | undefined = titleEl || statusEl ? {
      title: titleEl?.textContent?.trim() || 'NEXUS DASHBOARD',
      status: statusEl?.textContent?.trim() || 'CORE ONLINE',
    } : undefined;

    const moduleEls = root.querySelectorAll('modules > module');
    const modules: XnlModuleNode[] = [];

    moduleEls.forEach((el) => {
      modules.push({
        id: el.getAttribute('id') || undefined,
        status: el.getAttribute('status') || undefined,
        slot: el.getAttribute('slot') || undefined,
      });
    });

    return {
      tag: 'nexus-dashboard',
      header,
      modules,
    };
  }

  private static fallbackParse(xnlString: string): XnlAst {
    // Regex based fallback for resilience
    const titleMatch = xnlString.match(/<title>([^<]+)<\/title>/);
    const statusMatch = xnlString.match(/<status>([^<]+)<\/status>/);
    const moduleMatches = [...xnlString.matchAll(/<module\s+([^>]+)\/>/g)];

    const modules: XnlModuleNode[] = [];
    for (const match of moduleMatches) {
      const attrs = match[1];
      const idMatch = attrs.match(/id="([^"]+)"/);
      const statusMatchAttr = attrs.match(/status="([^"]+)"/);
      const slotMatch = attrs.match(/slot="([^"]+)"/);

      modules.push({
        id: idMatch ? idMatch[1] : undefined,
        status: statusMatchAttr ? statusMatchAttr[1] : undefined,
        slot: slotMatch ? slotMatch[1] : undefined,
      });
    }

    return {
      tag: 'nexus-dashboard',
      header: {
        title: titleMatch ? titleMatch[1].trim() : 'NEXUS DASHBOARD',
        status: statusMatch ? statusMatch[1].trim() : 'CORE ONLINE',
      },
      modules: modules.length > 0 ? modules : [{ slot: 'empty' }],
    };
  }
}
