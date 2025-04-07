import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="p-2">
      <h3 className="text-lg font-bold">Trang chủ PHPure</h3>
      <p>Chào mừng đến với tài liệu PHPure Framework.</p>
    </div>
  );
}
