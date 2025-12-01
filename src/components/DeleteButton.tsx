'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      Delete
    </button>
  );
}
