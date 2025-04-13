/**
 * Current version of documentation to fetch
 * This can be updated as newer versions are released
 */
export const CURRENT_DOC_VERSION = 'v0.x';

/**
 * Fetches raw content from a GitHub repository file
 *
 * @param path File path within the repository
 * @param branch Branch name (defaults to main)
 * @returns Promise containing the raw file content
 */
export async function fetchGithubContent(path: string, branch: string = 'main'): Promise<string> {
  const rawUrl = `https://raw.githubusercontent.com/mttk2004/phpure/${branch}/${path}`;

  try {
    const response = await fetch(rawUrl);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching GitHub content: ${error}`);
    throw error;
  }
}

/**
 * Fetches documentation content from the docs folder
 *
 * @param filename Documentation file name (e.g., "introduction.md")
 * @param language Language code (defaults to current language)
 * @param version Documentation version (defaults to current version)
 * @param branch Branch name (defaults to main)
 * @returns Promise containing the markdown content
 */
export async function fetchDocumentation(
  filename: string,
  language: string = 'en',
  version: string = CURRENT_DOC_VERSION,
  branch: string = 'main'
): Promise<string> {
  return fetchGithubContent(`docs/${version}/${language}/${filename}`, branch);
}

/**
 * Lists all available documentation files from the GitHub repository
 *
 * @param language Language code (defaults to current language)
 * @param version Documentation version (defaults to current version)
 * @param branch Branch name (defaults to main)
 * @returns Promise containing an array of documentation file names
 */
export async function listDocumentationFiles(
  language: string = 'en',
  version: string = CURRENT_DOC_VERSION,
  branch: string = 'main'
): Promise<string[]> {
  const apiUrl = `https://api.github.com/repos/mttk2004/phpure/contents/docs/${version}/${language}?ref=${branch}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filter for markdown files only and extract filenames
    return data
      .filter((item: any) => item.type === 'file' && item.name.endsWith('.md'))
      .map((item: any) => item.name);
  } catch (error) {
    console.error(`Error listing documentation files: ${error}`);
    throw error;
  }
}

/**
 * Gets the GitHub raw content URL for a specific file
 *
 * @param path File path within the repository
 * @param branch Branch name (defaults to main)
 * @returns The raw content URL
 */
export function getGithubRawUrl(path: string, branch: string = 'main'): string {
  return `https://raw.githubusercontent.com/mttk2004/phpure/${branch}/${path}`;
}
