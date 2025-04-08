/**
 * Định nghĩa cấu trúc mục lục (Table of Contents)
 */
export interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

/**
 * Mở rộng interface Window để bổ sung sự kiện content-rendered
 */
declare global {
  interface WindowEventMap {
    'content-rendered': Event;
  }
}
