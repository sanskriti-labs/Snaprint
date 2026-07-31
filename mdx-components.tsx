import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="font-display text-4xl md:text-5xl font-semibold mt-12 mb-4" {...props} />,
    h2: (props) => <h2 className="font-display text-2xl md:text-3xl font-semibold mt-10 mb-4" {...props} />,
    h3: (props) => <h3 className="font-display text-xl md:text-2xl font-semibold mt-8 mb-3" {...props} />,
    p: (props) => <p className="text-snap-charcoal/90 leading-relaxed mb-4" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
    a: (props) => <a className="text-snap-red underline underline-offset-2 hover:text-snap-red-dark" {...props} />,
    table: (props) => (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-snap-border text-sm" {...props} />
      </div>
    ),
    th: (props) => <th className="border border-snap-border bg-snap-surface px-3 py-2 text-left font-medium" {...props} />,
    td: (props) => <td className="border border-snap-border px-3 py-2" {...props} />,
    ...components,
  };
}
