/// <reference types="vite/client" />

declare module '*.mdx' {
  export const meta: Record<string, unknown>;

  interface MDXProps {
    components?: Record<string, React.ComponentType<unknown>>;
    [key: string]: unknown;
  }

  const MDXContent: (props: MDXProps) => JSX.Element;
  export default MDXContent;
}
